
import React from "react"
import { Handle, Position, MarkerType } from "@xyflow/react"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Trash2 } from "lucide-react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { toast } from "sonner"

interface ComponentItem {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

const triggerComponents: ComponentItem[] = [
  {
    id: "trigger",
    name: "Trigger",
    description: "Start the flow",
    icon: "⚡",
    color: "text-orange-500",
  },
  {
    id: "webhook",
    name: "Webhook",
    description: "API trigger",
    icon: "🔗",
    color: "text-purple-500",
  },
]

const actionComponents: ComponentItem[] = [
  {
    id: "email",
    name: "Email",
    description: "Send an email",
    icon: "✉️",
    color: "text-purple-500",
  },
  {
    id: "sms",
    name: "SMS",
    description: "Send text message",
    icon: "💬",
    color: "text-blue-500",
  },
  {
    id: "task",
    name: "Task",
    description: "Create a task",
    icon: "✓",
    color: "text-green-500",
  },
]

const logicComponents: ComponentItem[] = [
  {
    id: "condition",
    name: "Condition",
    description: "If/then logic",
    icon: "🔀",
    color: "text-blue-500",
  },
  {
    id: "delay",
    name: "Delay",
    description: "Wait period",
    icon: "⏰",
    color: "text-purple-500",
  },
  {
    id: "split-test",
    name: "Split Test",
    description: "A/B testing",
    icon: "🧪",
    color: "text-green-500",
  },
]

function ComponentCard({ component }: { component: ComponentItem }) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-grab active:cursor-grabbing transition-colors bg-white"
      draggable
      onDragStart={(event) => onDragStart(event, component.id)}
    >
      <div className={`text-lg ${component.color}`}>{component.icon}</div>
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-900">{component.name}</div>
        <div className="text-xs text-gray-500">{component.description}</div>
      </div>
    </div>
  )
}

function ComponentSection({
  title,
  subtitle,
  components,
}: {
  title: string
  subtitle: string
  components: ComponentItem[]
}) {
  return (
    <div className="mb-6">
      <div className="mb-3">
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-1">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="space-y-2">
        {components.map((component) => (
          <ComponentCard key={component.id} component={component} />
        ))}
      </div>
    </div>
  )
}

function CustomNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-gray-400" />
      <div className="flex items-center">
        <div className={`text-lg mr-2 ${data.color}`}>{data.icon}</div>
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.description}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-gray-400" />
    </div>
  )
}

function TriggerNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-200 min-w-[150px]">
      <div className="flex items-center">
        <div className={`text-lg mr-2 ${data.color}`}>{data.icon}</div>
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.description}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-orange-400" />
    </div>
  )
}

function ConditionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-200 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-blue-400" />
      <div className="flex items-center">
        <div className={`text-lg mr-2 ${data.color}`}>{data.icon}</div>
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.description}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        className="w-3 h-3 !bg-green-400"
        style={{ left: "30%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="w-3 h-3 !bg-red-400"
        style={{ left: "70%" }}
      />
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Yes</span>
        <span>No</span>
      </div>
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
  trigger: TriggerNode,
  condition: ConditionNode,
}

function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isLoading, setIsLoading] = useState(false)
  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow()

  const onConnect = useCallback(
    (params: Connection) => {
      const edge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#6366f1",
        },
      }
      setEdges((eds) => addEdge(edge, eds))
      toast.success("Connection created successfully!")
    },
    [setEdges],
  )

  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Prevent self-connections
      if (connection.source === connection.target) {
        return false
      }

      // Prevent duplicate connections
      const existingEdge = edges.find(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.targetHandle === connection.targetHandle,
      )

      return !existingEdge
    },
    [edges],
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      if (typeof type === "undefined" || !type) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // Find component data
      const allComponents = [...triggerComponents, ...actionComponents, ...logicComponents]
      const componentData = allComponents.find((comp) => comp.id === type)

      if (!componentData) return

      // Determine node type based on component
      let nodeType = "custom"
      if (type === "trigger" || type === "webhook") {
        nodeType = "trigger"
      } else if (type === "condition") {
        nodeType = "condition"
      }

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: componentData.name,
          description: componentData.description,
          icon: componentData.icon,
          color: componentData.color,
        },
      }

      setNodes((nds) => nds.concat(newNode))
      toast.success(`${componentData.name} node added to flow!`)
    },
    [screenToFlowPosition, setNodes],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onSave = useCallback(async () => {
    if (nodes.length === 0) {
      toast.error("Cannot save empty flow")
      return
    }

    setIsLoading(true)
    try {
      const flow = {
        nodes,
        edges,
        metadata: {
          name: "New Marketing Flow",
          created: new Date().toISOString(),
          nodeCount: nodes.length,
          connectionCount: edges.length,
        },
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store in localStorage for demo purposes
      localStorage.setItem("marketing-flow", JSON.stringify(flow))

      console.log("[v0] Flow saved:", flow)
      toast.success("Flow saved successfully!")
    } catch (error) {
      toast.error("Failed to save flow")
    } finally {
      setIsLoading(false)
    }
  }, [nodes, edges])

  const onClear = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) {
      toast.info("Canvas is already empty")
      return
    }

    setNodes([])
    setEdges([])
    toast.success("Canvas cleared!")
  }, [setNodes, setEdges, nodes.length, edges.length])

  const onExport = useCallback(() => {
    if (nodes.length === 0) {
      toast.error("Cannot export empty flow")
      return
    }

    const flow = {
      nodes,
      edges,
      metadata: {
        name: "New Marketing Flow",
        exported: new Date().toISOString(),
        nodeCount: nodes.length,
        connectionCount: edges.length,
      },
    }
    const dataStr = JSON.stringify(flow, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "marketing-flow.json"
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast.success("Flow exported successfully!")
  }, [nodes, edges])

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "s":
            event.preventDefault()
            onSave()
            break
          case "e":
            event.preventDefault()
            onExport()
            break
          case "Delete":
          case "Backspace":
            event.preventDefault()
            onClear()
            break
        }
      }
    },
    [onSave, onExport, onClear],
  )

  React.useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onKeyDown])

  return (
    <div className="flex-1 flex flex-col">
      {/* Header with node/connection counts */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Nodes: {nodes.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Connections: {edges.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Flow Builder</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">New Marketing Flow</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Drag & Drop Components</h2>
            <p className="text-xs text-gray-500 mb-4">
              Drag components to the canvas to build your marketing automation flow.
            </p>
          </div>

          <ComponentSection title="TRIGGERS" subtitle="Start your flows" components={triggerComponents} />
          <ComponentSection title="ACTIONS" subtitle="Marketing actions" components={actionComponents} />
          <ComponentSection title="LOGIC" subtitle="Flow control" components={logicComponents} />

          <div className="mt-8 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Keyboard Shortcuts</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Ctrl/Cmd + S: Save Flow</div>
              <div>Ctrl/Cmd + E: Export Flow</div>
              <div>Delete: Clear Canvas</div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            fitView
            className="bg-gray-50"
            connectionLineStyle={{ stroke: "#6366f1", strokeWidth: 2 }}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: true,
              style: { stroke: "#6366f1", strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
            }}
          >
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === "trigger") return "#f97316"
                if (node.type === "condition") return "#3b82f6"
                return "#6b7280"
              }}
            />
            
          </ReactFlow>

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400">
                <div className="text-lg mb-2">🎯</div>
                <div className="text-sm font-medium">Start building your flow</div>
                <div className="text-xs">Drag components from the sidebar to get started</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button className="bg-black text-white hover:bg-gray-800" onClick={onSave} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Flow"}
          </Button>
          <Button variant="outline" onClick={onExport} disabled={nodes.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={onClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        {nodes.length > 0 && (
          <div className="text-xs text-gray-500">Last modified: {new Date().toLocaleTimeString()}</div>
        )}
      </div>
    </div>
  )
}

export function FlowBuilder() {
  return (
    <div className="h-screen bg-gray-50">
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  )
}

