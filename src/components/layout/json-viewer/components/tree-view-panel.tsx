"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useMemo } from "react"
import { List } from "react-window"
import type { JsonNode } from "../types"

interface TreeViewPanelProps {
	treeData?: JsonNode[]
	onToggleNode?: (path: string) => void
}

interface TreeNodeProps {
	node: JsonNode
	onToggle: (path: string) => void
}

function TreeNode({ node, onToggle }: TreeNodeProps) {
	const hasChildren = node.children && node.children.length > 0
	const isExpanded = node.expanded

	const handleToggle = () => {
		if (hasChildren) {
			onToggle(node.path)
		}
	}

	const getTypeColor = (type: string) => {
		switch (type) {
			case "string":
				return "text-green-600"
			case "number":
				return "text-primary"
			case "boolean":
				return "text-purple-600"
			case "null":
				return "text-gray-500"
			case "array":
				return "text-orange-600"
			case "object":
				return "text-indigo-600"
			default:
				return "text-gray-900"
		}
	}

	const getValueDisplay = () => {
		if (node.type === "string") {
			return `"${node.value}"`
		}
		if (node.type === "null") {
			return "null"
		}
		if (node.type === "array") {
			return `Array[${node.children?.length || 0}]`
		}
		if (node.type === "object") {
			return `Object{${node.children?.length || 0}}`
		}
		return String(node.value)
	}

	return (
		<div className="select-none">
			<div
				className={cn(
					"flex cursor-pointer items-center px-2 py-1 hover:bg-gray-50",
					node.depth === 0 && "font-medium"
				)}
				style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
				onClick={handleToggle}>
				{hasChildren ? (
					isExpanded ? (
						<ChevronDown className="mr-1 h-4 w-4 text-gray-500" />
					) : (
						<ChevronRight className="mr-1 h-4 w-4 text-gray-500" />
					)
				) : (
					<div className="mr-1 h-4 w-4" />
				)}

				<span className="font-mono text-sm">
					{node.key !== "root" && <span className="text-gray-700">"{node.key}": </span>}
					<span className={getTypeColor(node.type)}>{getValueDisplay()}</span>
				</span>
			</div>

			{hasChildren && isExpanded && node.children && (
				<div>
					{node.children.map((child, index) => (
						<TreeNode key={`${child.path}-${index}`} node={child} onToggle={onToggle} />
					))}
				</div>
			)}
		</div>
	)
}

// Flatten tree for virtualization - only visible nodes
function flattenVisibleNodes(nodes: JsonNode[]): JsonNode[] {
	const result: JsonNode[] = []

	const traverse = (nodeList: JsonNode[]) => {
		for (const node of nodeList) {
			result.push(node)
			if (node.expanded && node.children && node.children.length > 0) {
				traverse(node.children)
			}
		}
	}

	traverse(nodes)
	return result
}

export function TreeViewPanel({ treeData, onToggleNode }: TreeViewPanelProps) {
	// Flatten only visible nodes for virtualization
	const visibleNodes = useMemo(() => {
		if (!treeData) return []
		return flattenVisibleNodes(treeData)
	}, [treeData])

	const useVirtualization = visibleNodes.length > 500

	if (!treeData || treeData.length === 0) {
		return (
			<div className="flex h-64 items-center justify-center text-gray-500">
				<div className="text-center">
					<div className="mb-2 text-lg">🌳</div>
					<p>No tree data available</p>
					<p className="text-sm">Process valid JSON to see the tree view</p>
				</div>
			</div>
		)
	}

	const renderNode = (node: JsonNode, index: number) => {
		const hasChildren = node.children && node.children.length > 0
		const isExpanded = node.expanded

		const getTypeColor = (type: string) => {
			switch (type) {
				case "string":
					return "text-green-600"
				case "number":
					return "text-primary"
				case "boolean":
					return "text-purple-600"
				case "null":
					return "text-gray-500"
				case "array":
					return "text-orange-600"
				case "object":
					return "text-indigo-600"
				default:
					return "text-gray-900"
			}
		}

		const getValueDisplay = () => {
			if (node.type === "string") {
				return `"${node.value}"`
			}
			if (node.type === "null") {
				return "null"
			}
			if (node.type === "array") {
				return `Array[${node.children?.length || 0}]`
			}
			if (node.type === "object") {
				return `Object{${node.children?.length || 0}}`
			}
			return String(node.value)
		}

		return (
			<div
				key={index}
				className={cn(
					"flex cursor-pointer items-center px-2 py-1 hover:bg-gray-50",
					node.depth === 0 && "font-medium"
				)}
				style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
				onClick={() => {
					if (hasChildren && onToggleNode) {
						onToggleNode(node.path)
					}
				}}>
				{hasChildren ? (
					isExpanded ? (
						<ChevronDown className="mr-1 h-4 w-4 text-gray-500" />
					) : (
						<ChevronRight className="mr-1 h-4 w-4 text-gray-500" />
					)
				) : (
					<div className="mr-1 h-4 w-4" />
				)}

				<span className="font-mono text-sm">
					{node.key !== "root" && <span className="text-gray-700">"{node.key}": </span>}
					<span className={getTypeColor(node.type)}>{getValueDisplay()}</span>
				</span>
			</div>
		)
	}

	return (
		<div className="border bg-white">
			<div className="border-b bg-gray-50 p-3">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="font-medium text-gray-900 text-sm">JSON Tree View</h3>
						<p className="text-gray-500 text-xs">Click on nodes with children to expand/collapse</p>
					</div>
					{useVirtualization && (
						<span className="bg-blue-100 px-2 py-0.5 text-blue-700 text-xs">
							{visibleNodes.length.toLocaleString()} visible nodes
						</span>
					)}
				</div>
			</div>

			<div className="p-4">
				{useVirtualization ? (
					// Virtualized tree for large datasets
					<div className="max-h-[60vh]">
						<List
							defaultHeight={Math.min(600, window.innerHeight * 0.6)}
							rowCount={visibleNodes.length}
							rowHeight={32}
							rowProps={{ visibleNodes }}
							rowComponent={({ index, visibleNodes: nodes }) => (
								<div className="select-none">{renderNode(nodes[index], index)}</div>
							)}
						/>
					</div>
				) : (
					// Regular tree view for smaller datasets
					<div className="max-h-[60vh] space-y-1 overflow-auto">
						{treeData.map((node, index) => (
							<TreeNode key={`root-${index}`} node={node} onToggle={onToggleNode || (() => {})} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}
