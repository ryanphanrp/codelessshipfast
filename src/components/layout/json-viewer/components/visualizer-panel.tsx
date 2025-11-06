"use client"

import { Badge } from "@/components/hexta-ui"
import { Button } from "@/components/hexta-ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/hexta-ui"
import { Input } from "@/components/hexta-ui"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/hexta-ui"
import { Separator } from "@/components/hexta-ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/hexta-ui"
import {
	Copy,
	Download,
	Eye,
	EyeOff,
	Maximize2,
	Network,
	RotateCcw,
	Search,
	TreePine,
	ZoomIn,
	ZoomOut
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { VisualizationLayout, VisualizationNode, VisualizationOptions } from "../types"
import {
	VISUALIZATION_EXAMPLES,
	calculateLayoutMetrics,
	createGraphLayout,
	createTreeLayout,
	exportVisualization,
	generateVisualizationNodes,
	getNodeColor,
	searchNodes
} from "../utils/json-visualizer"

interface VisualizerPanelProps {
	input: string
	error?: string | null
	isProcessing?: boolean
}

export function VisualizerPanel({ input, error, isProcessing }: VisualizerPanelProps) {
	const [layout, setLayout] = useState<"tree" | "graph">("tree")
	const [options, setOptions] = useState<VisualizationOptions>({
		maxDepth: 5,
		nodeSize: 12,
		showLabels: true,
		colorScheme: "type",
		compactMode: false
	})
	const [visualization, setVisualization] = useState<VisualizationNode[]>([])
	const [layoutData, setLayoutData] = useState<VisualizationLayout | null>(null)
	const [searchTerm, setSearchTerm] = useState("")
	const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set())
	const [selectedNode, setSelectedNode] = useState<VisualizationNode | null>(null)
	const [zoom, setZoom] = useState(1)
	const [pan, setPan] = useState({ x: 0, y: 0 })
	const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set())
	const [processingError, setProcessingError] = useState<string | null>(null)
	const [copySuccess, setCopySuccess] = useState(false)
	const [selectedExample, setSelectedExample] = useState<string>("")

	const svgRef = useRef<SVGSVGElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	// Generate visualization data when input changes
	useEffect(() => {
		if (input.trim() && !error && !isProcessing) {
			try {
				const parsedJson = JSON.parse(input)
				const nodes = generateVisualizationNodes(parsedJson, options)
				setVisualization(nodes)
				setProcessingError(null)
			} catch (err) {
				setProcessingError(err instanceof Error ? err.message : "Visualization generation failed")
				setVisualization([])
			}
		}
	}, [input, options, error, isProcessing])

	// Update layout when visualization or layout type changes
	useEffect(() => {
		if (visualization.length > 0) {
			try {
				let newLayout: VisualizationLayout
				if (layout === "tree") {
					newLayout = createTreeLayout(visualization, options)
				} else {
					newLayout = createGraphLayout(visualization, options)
				}
				setLayoutData(newLayout)
			} catch (err) {
				setProcessingError(err instanceof Error ? err.message : "Layout generation failed")
			}
		}
	}, [visualization, layout, options])

	// Handle search
	useEffect(() => {
		if (searchTerm.trim()) {
			const matches = searchNodes(visualization, searchTerm)
			setHighlightedNodes(new Set(matches.map((node) => node.id)))
		} else {
			setHighlightedNodes(new Set())
		}
	}, [searchTerm, visualization])

	const handleOptionChange = (key: keyof VisualizationOptions, value: any) => {
		setOptions((prev) => ({
			...prev,
			[key]: value
		}))
	}

	const handleZoomIn = () => {
		setZoom((prev) => Math.min(prev * 1.2, 3))
	}

	const handleZoomOut = () => {
		setZoom((prev) => Math.max(prev / 1.2, 0.1))
	}

	const handleReset = () => {
		setZoom(1)
		setPan({ x: 0, y: 0 })
		setHiddenNodes(new Set())
		setSelectedNode(null)
		setSearchTerm("")
	}

	const toggleNodeVisibility = (nodeId: string) => {
		setHiddenNodes((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(nodeId)) {
				newSet.delete(nodeId)
			} else {
				newSet.add(nodeId)
			}
			return newSet
		})
	}

	const handleNodeClick = (node: VisualizationNode) => {
		setSelectedNode(node)
	}

	const exportVisualizationData = async (format: "svg" | "png" | "json") => {
		if (!svgRef.current || !layoutData) return

		try {
			const result = await exportVisualization(svgRef.current, layoutData, format)

			if (format === "json") {
				await navigator.clipboard.writeText(result as string)
				setCopySuccess(true)
				setTimeout(() => setCopySuccess(false), 2000)
			} else {
				// For SVG/PNG, create download
				const blob = new Blob([result as string], {
					type: format === "svg" ? "image/svg+xml" : "image/png"
				})
				const url = URL.createObjectURL(blob)
				const a = document.createElement("a")
				a.href = url
				a.download = `visualization.${format}`
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
			}
		} catch (err) {
			setProcessingError(err instanceof Error ? err.message : "Export failed")
		}
	}

	const loadExample = (exampleKey: string) => {
		const example = VISUALIZATION_EXAMPLES[exampleKey as keyof typeof VISUALIZATION_EXAMPLES]
		if (example) {
			setSelectedExample(exampleKey)
			try {
				const nodes = generateVisualizationNodes(example.data, options)
				setVisualization(nodes)
				setProcessingError(null)
			} catch (err) {
				setProcessingError(err instanceof Error ? err.message : "Example loading failed")
			}
		}
	}

	const getNodeStats = () => {
		if (!layoutData) return { total: 0, visible: 0, hidden: 0 }

		const total = layoutData.nodes.length
		const hidden = hiddenNodes.size
		return {
			total,
			visible: total - hidden,
			hidden
		}
	}

	const metrics = layoutData ? calculateLayoutMetrics(layoutData) : null

	return (
		<div className="space-y-4">
			{/* Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm">
						<Network className="h-4 w-4" />
						Visualization Controls
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						{/* Layout Type */}
						<div className="space-y-2">
							<label className="font-medium text-sm">Layout</label>
							<Select value={layout} onValueChange={(value: "tree" | "graph") => setLayout(value)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="tree">
										<div className="flex items-center gap-2">
											<TreePine className="h-4 w-4" />
											Tree
										</div>
									</SelectItem>
									<SelectItem value="graph">
										<div className="flex items-center gap-2">
											<Network className="h-4 w-4" />
											Graph
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Max Depth */}
						<div className="space-y-2">
							<label className="font-medium text-sm">Max Depth</label>
							<Select
								value={options.maxDepth.toString()}
								onValueChange={(value) => handleOptionChange("maxDepth", parseInt(value))}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{[3, 4, 5, 6, 7, 8, 10].map((depth) => (
										<SelectItem key={depth} value={depth.toString()}>
											{depth} levels
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Color Scheme */}
						<div className="space-y-2">
							<label className="font-medium text-sm">Color Scheme</label>
							<Select
								value={options.colorScheme}
								onValueChange={(value: "type" | "depth" | "value") =>
									handleOptionChange("colorScheme", value)
								}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="type">By Type</SelectItem>
									<SelectItem value="depth">By Depth</SelectItem>
									<SelectItem value="value">By Value</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Node Size */}
						<div className="space-y-2">
							<label className="font-medium text-sm">Node Size</label>
							<Select
								value={options.nodeSize.toString()}
								onValueChange={(value) => handleOptionChange("nodeSize", parseInt(value))}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="8">Small (8px)</SelectItem>
									<SelectItem value="12">Medium (12px)</SelectItem>
									<SelectItem value="16">Large (16px)</SelectItem>
									<SelectItem value="20">Extra Large (20px)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Search and Controls */}
					<div className="flex flex-wrap items-center gap-2">
						<div className="min-w-[200px] flex-1">
							<div className="relative">
								<Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search nodes..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-8"
								/>
							</div>
						</div>

						<div className="flex items-center gap-1">
							<Button variant="outline" size="sm" onClick={handleZoomIn}>
								<ZoomIn className="h-4 w-4" />
							</Button>
							<Button variant="outline" size="sm" onClick={handleZoomOut}>
								<ZoomOut className="h-4 w-4" />
							</Button>
							<Button variant="outline" size="sm" onClick={handleReset}>
								<RotateCcw className="h-4 w-4" />
							</Button>
						</div>

						<Select value={selectedExample} onValueChange={loadExample}>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Load example" />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(VISUALIZATION_EXAMPLES).map(([key, example]) => (
									<SelectItem key={key} value={key}>
										{example.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Stats */}
					{metrics && (
						<div className="flex flex-wrap gap-2">
							<Badge variant="outline">
								Nodes: {getNodeStats().visible}/{getNodeStats().total}
							</Badge>
							<Badge variant="outline">Edges: {metrics.edges}</Badge>
							<Badge variant="outline">Max Depth: {metrics.maxDepth}</Badge>
							<Badge variant="outline">Zoom: {Math.round(zoom * 100)}%</Badge>
							{highlightedNodes.size > 0 && (
								<Badge variant="default">Found: {highlightedNodes.size}</Badge>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Visualization */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Maximize2 className="h-4 w-4" />
							Visualization
						</CardTitle>

						<div className="flex items-center gap-1">
							<Button variant="outline" size="sm" onClick={() => exportVisualizationData("json")}>
								<Copy className="mr-1 h-4 w-4" />
								{copySuccess ? "Copied!" : "Copy Data"}
							</Button>
							<Button variant="outline" size="sm" onClick={() => exportVisualizationData("svg")}>
								<Download className="mr-1 h-4 w-4" />
								SVG
							</Button>
							<Button variant="outline" size="sm" onClick={() => exportVisualizationData("png")}>
								<Download className="mr-1 h-4 w-4" />
								PNG
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{processingError ? (
						<div className="flex items-center gap-2 text-destructive">
							<span className="text-sm">{processingError}</span>
						</div>
					) : !layoutData ? (
						<div className="flex h-[400px] items-center justify-center text-muted-foreground">
							<span>Enter valid JSON to generate visualization</span>
						</div>
					) : (
						<div className="overflow-hidden rounded-lg border">
							<div
								ref={containerRef}
								className="relative bg-background"
								style={{ height: "500px" }}>
								<svg
									ref={svgRef}
									width="100%"
									height="100%"
									viewBox={`${pan.x} ${pan.y} ${800 / zoom} ${500 / zoom}`}
									className="cursor-move">
									{/* Render edges first */}
									{layoutData.edges
										.filter(
											(edge) =>
												edge.x1 !== undefined &&
												edge.y1 !== undefined &&
												edge.x2 !== undefined &&
												edge.y2 !== undefined
										)
										.map((edge) => (
											<line
												key={`${edge.source}-${edge.target}`}
												x1={edge.x1!}
												y1={edge.y1!}
												x2={edge.x2!}
												y2={edge.y2!}
												stroke="#94a3b8"
												strokeWidth="1"
												opacity="0.6"
											/>
										))}

									{/* Render nodes */}
									{layoutData.nodes
										.filter(
											(node) =>
												!hiddenNodes.has(node.id) && node.x !== undefined && node.y !== undefined
										)
										.map((node) => {
											const isHighlighted = highlightedNodes.has(node.id)
											const isSelected = selectedNode?.id === node.id
											const color = getNodeColor(node, options.colorScheme)

											return (
												<g key={node.id}>
													<circle
														cx={node.x!}
														cy={node.y!}
														r={options.nodeSize}
														fill={color}
														stroke={isSelected ? "#2563eb" : isHighlighted ? "#f59e0b" : "#64748b"}
														strokeWidth={isSelected ? 3 : isHighlighted ? 2 : 1}
														className="cursor-pointer transition-opacity hover:opacity-80"
														onClick={() => handleNodeClick(node)}
													/>

													{options.showLabels && (
														<text
															x={node.x!}
															y={node.y! - options.nodeSize - 4}
															textAnchor="middle"
															fontSize="10"
															fill="currentColor"
															className="pointer-events-none select-none">
															{node.label.length > 12
																? `${node.label.substring(0, 12)}...`
																: node.label}
														</text>
													)}
												</g>
											)
										})}
								</svg>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Node Details */}
			{selectedNode && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<Eye className="h-4 w-4" />
								Node Details
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => toggleNodeVisibility(selectedNode.id)}>
								{hiddenNodes.has(selectedNode.id) ? (
									<>
										<EyeOff className="mr-1 h-4 w-4" /> Hidden
									</>
								) : (
									<>
										<Eye className="mr-1 h-4 w-4" /> Visible
									</>
								)}
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-medium">Path:</span>
									<div className="mt-1 rounded bg-muted p-2 font-mono text-xs">
										{selectedNode.path}
									</div>
								</div>
								<div>
									<span className="font-medium">Type:</span>
									<Badge variant="outline" className="ml-2">
										{selectedNode.type}
									</Badge>
								</div>
							</div>

							<div>
								<span className="font-medium">Value:</span>
								<div className="mt-1 max-h-32 overflow-y-auto rounded bg-muted p-2 font-mono text-xs">
									{typeof selectedNode.value === "string"
										? selectedNode.value
										: JSON.stringify(selectedNode.value, null, 2)}
								</div>
							</div>

							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary">Depth: {selectedNode.depth}</Badge>
								{selectedNode.children && (
									<Badge variant="secondary">Children: {selectedNode.children.length}</Badge>
								)}
								<Badge variant="secondary">Size: {selectedNode.size}</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
