"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
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
				return "text-blue-600"
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
					"flex cursor-pointer items-center  px-2 py-1 hover:bg-gray-50",
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

export function TreeViewPanel({ treeData, onToggleNode }: TreeViewPanelProps) {
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

	return (
		<div className="max-h-96 overflow-auto  border bg-white">
			<div className="p-4">
				<div className="mb-4">
					<h3 className="mb-2 font-medium text-gray-900 text-sm">JSON Tree View</h3>
					<p className="text-gray-500 text-xs">Click on nodes with children to expand/collapse</p>
				</div>

				<div className="space-y-1">
					{treeData.map((node, index) => (
						<TreeNode key={`root-${index}`} node={node} onToggle={onToggleNode || (() => {})} />
					))}
				</div>
			</div>
		</div>
	)
}
