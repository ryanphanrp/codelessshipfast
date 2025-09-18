import type { 
	VisualizationData, 
	VisualNode, 
	VisualEdge,
	VisualizationNode,
	VisualizationEdge,
	VisualizationLayout,
	VisualizationOptions,
	LayoutMetrics
} from "../types"

export function generateVisualizationData(json: any, rootLabel = "root"): VisualizationData {
	const nodes: VisualNode[] = []
	const edges: VisualEdge[] = []
	let nodeIdCounter = 0

	function generateId(): string {
		return `node_${nodeIdCounter++}`
	}

	function processValue(
		value: any, 
		parentId: string | null, 
		label: string, 
		depth: number = 0
	): string {
		const nodeId = generateId()
		const dataType = getValueType(value)

		const node: VisualNode = {
			id: nodeId,
			label: label,
			type: getNodeType(value),
			dataType,
			value: isPrimitive(value) ? value : undefined,
			parent: parentId || undefined,
			depth,
			expanded: depth < 3, // Auto-expand first 3 levels
			children: []
		}

		nodes.push(node)

		// Create edge from parent to this node
		if (parentId) {
			edges.push({
				id: `edge_${parentId}_${nodeId}`,
				source: parentId,
				target: nodeId,
				label: label
			})

			// Add this node as child to parent
			const parentNode = nodes.find(n => n.id === parentId)
			if (parentNode) {
				parentNode.children = parentNode.children || []
				parentNode.children.push(nodeId)
			}
		}

		// Process children for objects and arrays
		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				processValue(item, nodeId, `[${index}]`, depth + 1)
			})
		} else if (typeof value === "object" && value !== null) {
			Object.entries(value).forEach(([key, val]) => {
				processValue(val, nodeId, key, depth + 1)
			})
		}

		return nodeId
	}

	processValue(json, null, rootLabel)

	return { nodes, edges }
}

function getValueType(value: any): string {
	if (value === null) return "null"
	if (value === undefined) return "undefined"
	if (Array.isArray(value)) return "array"
	if (typeof value === "object") return "object"
	if (typeof value === "string") return "string"
	if (typeof value === "number") {
		return Number.isInteger(value) ? "integer" : "number"
	}
	if (typeof value === "boolean") return "boolean"
	return "unknown"
}

function getNodeType(value: any): VisualNode['type'] {
	if (Array.isArray(value)) return "array"
	if (typeof value === "object" && value !== null) return "object"
	return "value"
}

function isPrimitive(value: any): boolean {
	return value === null || 
		   value === undefined || 
		   typeof value === "string" || 
		   typeof value === "number" || 
		   typeof value === "boolean"
}

export function filterNodes(
	data: VisualizationData, 
	options: {
		searchQuery?: string
		filterType?: string
		maxDepth?: number
	}
): VisualizationData {
	const { searchQuery, filterType, maxDepth } = options
	let filteredNodes = [...data.nodes]
	let filteredEdges = [...data.edges]

	// Filter by search query
	if (searchQuery && searchQuery.trim()) {
		const query = searchQuery.toLowerCase()
		const matchingNodeIds = new Set<string>()
		
		// Find nodes that match the search query
		filteredNodes.forEach(node => {
			const matches = 
				node.label.toLowerCase().includes(query) ||
				(node.value && String(node.value).toLowerCase().includes(query)) ||
				(node.dataType && node.dataType.toLowerCase().includes(query))
			
			if (matches) {
				// Include the matching node and all its ancestors and descendants
				addNodeAndRelatives(node.id, data, matchingNodeIds)
			}
		})

		filteredNodes = filteredNodes.filter(node => matchingNodeIds.has(node.id))
		filteredEdges = filteredEdges.filter(edge => 
			matchingNodeIds.has(edge.source) && matchingNodeIds.has(edge.target)
		)
	}

	// Filter by data type
	if (filterType && filterType !== "all") {
		const matchingNodeIds = new Set<string>()
		
		filteredNodes.forEach(node => {
			if (node.dataType === filterType) {
				addNodeAndRelatives(node.id, data, matchingNodeIds)
			}
		})

		filteredNodes = filteredNodes.filter(node => matchingNodeIds.has(node.id))
		filteredEdges = filteredEdges.filter(edge => 
			matchingNodeIds.has(edge.source) && matchingNodeIds.has(edge.target)
		)
	}

	// Filter by depth
	if (maxDepth !== undefined) {
		filteredNodes = filteredNodes.filter(node => node.depth <= maxDepth)
		filteredEdges = filteredEdges.filter(edge => {
			const sourceNode = filteredNodes.find(n => n.id === edge.source)
			const targetNode = filteredNodes.find(n => n.id === edge.target)
			return sourceNode && targetNode
		})
	}

	return {
		nodes: filteredNodes,
		edges: filteredEdges
	}
}

function addNodeAndRelatives(
	nodeId: string, 
	data: VisualizationData, 
	resultSet: Set<string>
): void {
	if (resultSet.has(nodeId)) return

	const node = data.nodes.find(n => n.id === nodeId)
	if (!node) return

	resultSet.add(nodeId)

	// Add ancestors
	let current = node
	while (current.parent) {
		resultSet.add(current.parent)
		current = data.nodes.find(n => n.id === current.parent)!
	}

	// Add descendants
	function addDescendants(currentNodeId: string): void {
		const currentNode = data.nodes.find(n => n.id === currentNodeId)
		if (currentNode?.children) {
			currentNode.children.forEach(childId => {
				resultSet.add(childId)
				addDescendants(childId)
			})
		}
	}

	addDescendants(nodeId)
}

export function calculateNodePositions(
	data: VisualizationData,
	layout: "tree" | "radial" | "force" = "tree",
	dimensions: { width: number; height: number } = { width: 800, height: 600 }
): VisualizationData {
	const { width, height } = dimensions
	const nodesWithPositions = [...data.nodes]

	switch (layout) {
		case "tree":
			calculateTreeLayout(nodesWithPositions, width, height)
			break
		case "radial":
			calculateRadialLayout(nodesWithPositions, width, height)
			break
		case "force":
			calculateForceLayout(nodesWithPositions, data.edges, width, height)
			break
	}

	return {
		...data,
		nodes: nodesWithPositions
	}
}

function calculateTreeLayout(nodes: VisualNode[], width: number, height: number): void {
	const root = nodes.find(node => !node.parent)
	if (!root) return

	const levels: VisualNode[][] = []
	
	// Group nodes by depth
	nodes.forEach(node => {
		if (!levels[node.depth]) {
			levels[node.depth] = []
		}
		levels[node.depth].push(node)
	})

	// Position nodes level by level
	levels.forEach((levelNodes, depth) => {
		const y = (height / (levels.length + 1)) * (depth + 1)
		const spacing = width / (levelNodes.length + 1)
		
		levelNodes.forEach((node, index) => {
			const x = spacing * (index + 1)
			// Add position to node (in a real implementation, you'd extend the interface)
			;(node as any).x = x
			;(node as any).y = y
		})
	})
}

function calculateRadialLayout(nodes: VisualNode[], width: number, height: number): void {
	const centerX = width / 2
	const centerY = height / 2
	const maxRadius = Math.min(width, height) / 2 - 50

	const root = nodes.find(node => !node.parent)
	if (!root) return

	// Position root at center
	;(root as any).x = centerX
	;(root as any).y = centerY

	// Group nodes by depth (excluding root)
	const levels: VisualNode[][] = []
	nodes.filter(node => node.parent).forEach(node => {
		const adjustedDepth = node.depth - 1 // Adjust since root is at center
		if (!levels[adjustedDepth]) {
			levels[adjustedDepth] = []
		}
		levels[adjustedDepth].push(node)
	})

	// Position nodes in concentric circles
	levels.forEach((levelNodes, levelIndex) => {
		const radius = (maxRadius / levels.length) * (levelIndex + 1)
		const angleStep = (2 * Math.PI) / levelNodes.length
		
		levelNodes.forEach((node, index) => {
			const angle = angleStep * index
			const x = centerX + radius * Math.cos(angle)
			const y = centerY + radius * Math.sin(angle)
			
			;(node as any).x = x
			;(node as any).y = y
		})
	})
}

function calculateForceLayout(
	nodes: VisualNode[], 
	edges: VisualEdge[], 
	width: number, 
	height: number
): void {
	// Simple force-directed layout simulation
	// In a real implementation, you'd use a proper physics engine or library like D3-force
	
	// Initialize random positions
	nodes.forEach(node => {
		;(node as any).x = Math.random() * width
		;(node as any).y = Math.random() * height
		;(node as any).vx = 0
		;(node as any).vy = 0
	})

	// Run simulation for a fixed number of iterations
	for (let i = 0; i < 100; i++) {
		// Apply forces
		nodes.forEach(node => {
			let fx = 0
			let fy = 0

			// Repulsion from other nodes
			nodes.forEach(other => {
				if (node.id !== other.id) {
					const dx = (node as any).x - (other as any).x
					const dy = (node as any).y - (other as any).y
					const distance = Math.sqrt(dx * dx + dy * dy) || 1
					const force = 1000 / (distance * distance)
					fx += (dx / distance) * force
					fy += (dy / distance) * force
				}
			})

			// Attraction along edges
			edges.forEach(edge => {
				if (edge.source === node.id) {
					const target = nodes.find(n => n.id === edge.target)
					if (target) {
						const dx = (target as any).x - (node as any).x
						const dy = (target as any).y - (node as any).y
						const distance = Math.sqrt(dx * dx + dy * dy) || 1
						const force = distance * 0.01
						fx += (dx / distance) * force
						fy += (dy / distance) * force
					}
				}
			})

			// Update velocity and position
			;(node as any).vx = ((node as any).vx + fx) * 0.8
			;(node as any).vy = ((node as any).vy + fy) * 0.8
			;(node as any).x += (node as any).vx
			;(node as any).y += (node as any).vy

			// Keep nodes within bounds
			;(node as any).x = Math.max(50, Math.min(width - 50, (node as any).x))
			;(node as any).y = Math.max(50, Math.min(height - 50, (node as any).y))
		})
	}
}

export function exportVisualizationData(
	data: VisualizationData, 
	format: "json" | "csv" | "dot"
): string {
	switch (format) {
		case "json":
			return JSON.stringify(data, null, 2)
		
		case "csv":
			const headers = ["ID", "Label", "Type", "DataType", "Value", "Parent", "Depth"]
			const rows = data.nodes.map(node => [
				node.id,
				node.label,
				node.type,
				node.dataType,
				node.value?.toString() || "",
				node.parent || "",
				node.depth.toString()
			])
			return [headers, ...rows]
				.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
				.join("\n")
		
		case "dot":
			// GraphViz DOT format
			let dot = "digraph JsonStructure {\n"
			dot += "  rankdir=TB;\n"
			dot += "  node [shape=box];\n\n"
			
			data.nodes.forEach(node => {
				const dataType = node.dataType || 'unknown'
				const color = getOriginalNodeColor(dataType)
				dot += `  "${node.id}" [label="${node.label}\\n(${dataType})" fillcolor="${color}" style=filled];\n`
			})
			
			dot += "\n"
			
			data.edges.forEach(edge => {
				dot += `  "${edge.source}" -> "${edge.target}";\n`
			})
			
			dot += "}\n"
			return dot
		
		default:
			throw new Error(`Unsupported format: ${format}`)
	}
}

function getOriginalNodeColor(dataType: string): string {
	const colors: Record<string, string> = {
		object: "#e3f2fd",
		array: "#f3e5f5",
		string: "#e8f5e8",
		number: "#fff3e0",
		integer: "#fff3e0",
		boolean: "#fce4ec",
		null: "#f5f5f5"
	}
	return colors[dataType] || "#ffffff"
}

export function getVisualizationStats(data: VisualizationData): {
	totalNodes: number
	maxDepth: number
	nodesByType: Record<string, number>
	nodesByDataType: Record<string, number>
} {
	const nodesByType: Record<string, number> = {}
	const nodesByDataType: Record<string, number> = {}
	let maxDepth = 0

	data.nodes.forEach(node => {
		nodesByType[node.type] = (nodesByType[node.type] || 0) + 1
		const dataType = node.dataType || 'unknown'
		nodesByDataType[dataType] = (nodesByDataType[dataType] || 0) + 1
		maxDepth = Math.max(maxDepth, node.depth)
	})

	return {
		totalNodes: data.nodes.length,
		maxDepth,
		nodesByType,
		nodesByDataType
	}
}

// Enhanced functions for new visualizer panel
export function generateVisualizationNodes(json: any, options: VisualizationOptions): VisualizationNode[] {
	const data = generateVisualizationData(json)
	return data.nodes.map((node, index) => ({
		...node,
		size: calculateNodeSize(node, options),
		path: generateNodePath(node, data.nodes)
	}))
}

function calculateNodeSize(node: VisualNode, options: VisualizationOptions): number {
	if (node.type === 'object' || node.type === 'array') {
		return options.nodeSize * 1.5
	}
	return options.nodeSize
}

function generateNodePath(node: VisualNode, allNodes: VisualNode[]): string {
	const path: string[] = []
	let current = node
	
	while (current) {
		path.unshift(current.label)
		if (!current.parent) break
		current = allNodes.find(n => n.id === current.parent)!
	}
	
	return path.join('.')
}

export function createTreeLayout(
	nodes: VisualizationNode[], 
	options: VisualizationOptions
): VisualizationLayout {
	const width = 800
	const height = 600
	const layoutNodes = [...nodes]

	// Use existing tree layout calculation
	calculateTreeLayout(layoutNodes as any[], width, height)

	// Generate edges with positions
	const layoutEdges: VisualizationEdge[] = []
	layoutNodes.forEach(node => {
		if (node.parent) {
			const parentNode = layoutNodes.find(n => n.id === node.parent)
			if (parentNode) {
				layoutEdges.push({
					id: `edge_${node.parent}_${node.id}`,
					source: node.parent,
					target: node.id,
					x1: (parentNode as any).x,
					y1: (parentNode as any).y,
					x2: (node as any).x,
					y2: (node as any).y
				})
			}
		}
	})

	return {
		nodes: layoutNodes,
		edges: layoutEdges,
		width,
		height
	}
}

export function createGraphLayout(
	nodes: VisualizationNode[], 
	options: VisualizationOptions
): VisualizationLayout {
	const width = 800
	const height = 600
	const layoutNodes = [...nodes]

	// Use existing force layout calculation
	const edges: VisualEdge[] = []
	layoutNodes.forEach(node => {
		if (node.parent) {
			edges.push({
				id: `edge_${node.parent}_${node.id}`,
				source: node.parent,
				target: node.id
			})
		}
	})

	calculateForceLayout(layoutNodes as any[], edges as any[], width, height)

	// Generate edges with positions
	const layoutEdges: VisualizationEdge[] = []
	layoutNodes.forEach(node => {
		if (node.parent) {
			const parentNode = layoutNodes.find(n => n.id === node.parent)
			if (parentNode) {
				layoutEdges.push({
					id: `edge_${node.parent}_${node.id}`,
					source: node.parent,
					target: node.id,
					x1: (parentNode as any).x,
					y1: (parentNode as any).y,
					x2: (node as any).x,
					y2: (node as any).y
				})
			}
		}
	})

	return {
		nodes: layoutNodes,
		edges: layoutEdges,
		width,
		height
	}
}

export function searchNodes(nodes: VisualizationNode[], query: string): VisualizationNode[] {
	const searchTerm = query.toLowerCase()
	return nodes.filter(node => 
		node.label.toLowerCase().includes(searchTerm) ||
		(node.value && String(node.value).toLowerCase().includes(searchTerm)) ||
		(node.dataType && node.dataType.toLowerCase().includes(searchTerm)) ||
		(node.path && node.path.toLowerCase().includes(searchTerm))
	)
}

export async function exportVisualization(
	svgElement: SVGSVGElement,
	layout: VisualizationLayout,
	format: 'svg' | 'png' | 'json'
): Promise<string> {
	switch (format) {
		case 'json':
			return JSON.stringify(layout, null, 2)
		
		case 'svg':
			// Return SVG as string
			const serializer = new XMLSerializer()
			return serializer.serializeToString(svgElement)
		
		case 'png':
			// For PNG, we'd need to convert SVG to canvas then to PNG
			// This is a simplified version - in practice you'd use a library
			return 'PNG export not fully implemented in demo'
		
		default:
			throw new Error(`Unsupported format: ${format}`)
	}
}

export function getNodeColor(
	node: VisualizationNode, 
	colorScheme: 'type' | 'depth' | 'value'
): string {
	switch (colorScheme) {
		case 'type':
			const typeColors: Record<string, string> = {
				object: '#3b82f6',
				array: '#8b5cf6',
				property: '#10b981',
				value: '#f59e0b'
			}
			return typeColors[node.type] || '#6b7280'
		
		case 'depth':
			const intensity = Math.min(node.depth * 40, 200)
			return `hsl(220, 80%, ${80 - intensity / 4}%)`
		
		case 'value':
			if (!node.dataType) return '#6b7280'
			const valueColors: Record<string, string> = {
				string: '#10b981',
				number: '#f59e0b',
				integer: '#f59e0b',
				boolean: '#ef4444',
				null: '#6b7280',
				array: '#8b5cf6',
				object: '#3b82f6'
			}
			return valueColors[node.dataType] || '#6b7280'
		
		default:
			return '#6b7280'
	}
}

export function calculateLayoutMetrics(layout: VisualizationLayout): LayoutMetrics {
	const maxDepth = Math.max(...layout.nodes.map(n => n.depth))
	
	return {
		totalNodes: layout.nodes.length,
		visibleNodes: layout.nodes.length,
		totalEdges: layout.edges.length,
		maxDepth,
		edges: layout.edges.length
	}
}

// Sample visualization examples
export const VISUALIZATION_EXAMPLES = {
	simple: {
		name: 'Simple Object',
		data: {
			name: 'John Doe',
			age: 30,
			city: 'New York'
		}
	},
	nested: {
		name: 'Nested Object',
		data: {
			user: {
				profile: {
					name: 'John Doe',
					age: 30
				},
				preferences: {
					theme: 'dark',
					notifications: true
				}
			}
		}
	},
	array: {
		name: 'Array Example',
		data: {
			items: [
				{ id: 1, name: 'Item 1' },
				{ id: 2, name: 'Item 2' },
				{ id: 3, name: 'Item 3' }
			]
		}
	}
}
