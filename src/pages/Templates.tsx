"use client"

import { useState } from "react"
import { ArrowLeft, Search, Eye, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlowBuilder } from "./FlowBuilder"
import { useNavigate } from "react-router-dom"

interface Template {
  id: number
  title: string
  description: string
  category: string
  duration: string
  steps: number
  connections: number
  categoryColor: string
  flowData?: {
    nodes: any[]
    edges: any[]
  }
}

const allTemplates: Template[] = [
  {
    id: 1,
    title: "Welcome Email Series",
    description: "A 5-email welcome sequence for new subscribers",
    category: "onboarding",
    duration: "7 days",
    steps: 4,
    connections: 3,
    categoryColor: "bg-orange-100 text-orange-800",
    flowData: {
      nodes: [
        {
          id: "trigger-1",
          type: "trigger",
          position: { x: 250, y: 50 },
          data: {
            label: "New Subscriber",
            description: "User signs up",
            icon: "⚡",
            color: "text-orange-500",
          },
        },
        {
          id: "email-1",
          type: "custom",
          position: { x: 250, y: 150 },
          data: {
            label: "Welcome Email",
            description: "Send welcome message",
            icon: "✉️",
            color: "text-purple-500",
          },
        },
        {
          id: "delay-1",
          type: "custom",
          position: { x: 250, y: 250 },
          data: {
            label: "Wait 1 Day",
            description: "Delay before next email",
            icon: "⏰",
            color: "text-purple-500",
          },
        },
        {
          id: "email-2",
          type: "custom",
          position: { x: 250, y: 350 },
          data: {
            label: "Getting Started",
            description: "Help users get started",
            icon: "✉️",
            color: "text-purple-500",
          },
        },
      ],
      edges: [
        {
          id: "e1-2",
          source: "trigger-1",
          target: "email-1",
          type: "smoothstep",
          animated: true,
        },
        {
          id: "e2-3",
          source: "email-1",
          target: "delay-1",
          type: "smoothstep",
          animated: true,
        },
        {
          id: "e3-4",
          source: "delay-1",
          target: "email-2",
          type: "smoothstep",
          animated: true,
        },
      ],
    },
  },
  {
    id: 2,
    title: "Lead Nurturing Campaign",
    description: "Convert leads to customers with targeted content",
    category: "nurturing",
    duration: "14 days",
    steps: 4,
    connections: 3,
    categoryColor: "bg-green-100 text-green-800",
    flowData: {
      nodes: [
        {
          id: "trigger-2",
          type: "trigger",
          position: { x: 250, y: 50 },
          data: {
            label: "Lead Captured",
            description: "New lead enters system",
            icon: "⚡",
            color: "text-orange-500",
          },
        },
        {
          id: "condition-1",
          type: "condition",
          position: { x: 250, y: 150 },
          data: {
            label: "Lead Score Check",
            description: "Check lead quality",
            icon: "🔀",
            color: "text-blue-500",
          },
        },
        {
          id: "email-3",
          type: "custom",
          position: { x: 150, y: 280 },
          data: {
            label: "High Value Content",
            description: "Send premium content",
            icon: "✉️",
            color: "text-purple-500",
          },
        },
        {
          id: "email-4",
          type: "custom",
          position: { x: 350, y: 280 },
          data: {
            label: "Basic Content",
            description: "Send introductory content",
            icon: "✉️",
            color: "text-purple-500",
          },
        },
      ],
      edges: [
        {
          id: "e1-2",
          source: "trigger-2",
          target: "condition-1",
          type: "smoothstep",
          animated: true,
        },
        {
          id: "e2-3",
          source: "condition-1",
          target: "email-3",
          sourceHandle: "yes",
          type: "smoothstep",
          animated: true,
        },
        {
          id: "e2-4",
          source: "condition-1",
          target: "email-4",
          sourceHandle: "no",
          type: "smoothstep",
          animated: true,
        },
      ],
    },
  },
  {
    id: 3,
    title: "Abandoned Cart Recovery",
    description: "Win back customers who left items in their cart",
    category: "retention",
    duration: "3 days",
    steps: 5,
    connections: 4,
    categoryColor: "bg-red-100 text-red-800",
    flowData: {
      nodes: [
        {
          id: "trigger-3",
          type: "trigger",
          position: { x: 250, y: 50 },
          data: {
            label: "Cart Abandoned",
            description: "User leaves items in cart",
            icon: "⚡",
            color: "text-orange-500",
          },
        },
        {
          id: "delay-2",
          type: "custom",
          position: { x: 250, y: 150 },
          data: {
            label: "Wait 1 Hour",
            description: "Give user time to return",
            icon: "⏰",
            color: "text-purple-500",
          },
        },
        {
          id: "email-5",
          type: "custom",
          position: { x: 250, y: 250 },
          data: {
            label: "Reminder Email",
            description: "Remind about cart items",
            icon: "✉️",
            color: "text-purple-500",
          },
        },
        {
          id: "delay-3",
          type: "custom",
          position: { x: 250, y: 350 },
          data: {
            label: "Wait 24 Hours",
            description: "Wait before discount offer",
            icon: "⏰",
            color: "text-purple-500",
          },
        },
        {
          id: "email-6",
          type: "custom",
          position: { x: 250, y: 450 },
          data: {
            label: "Discount Offer",
            description: "Send discount to recover sale",
            icon: "✉️",
            color: "text-purple-500",
          },
        },
      ],
      edges: [
        {
          id: "e1-2",
          source: "trigger-3",
          target: "delay-2",
          type: "smoothstep",
          animated: true,
        },
        {
          id: "e2-3",
          source: "delay-2",
          target: "email-5",
          type: "smoothstep",
          animated: true,
        },
        {
          id: "e3-4",
          source: "email-5",
          target: "delay-3",
          type: "smoothstep",
          animated: true,
        },
        {
          id: "e4-5",
          source: "delay-3",
          target: "email-6",
          type: "smoothstep",
          animated: true,
        },
      ],
    },
  },
]

const filterTabs = ["All", "Email", "Nurturing", "Onboarding", "Retention"]

export default function Template() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentView, setCurrentView] = useState<"library" | "builder">("library")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const navigate = useNavigate()

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesFilter =
      activeFilter === "All" ||
      template.category.toLowerCase() === activeFilter.toLowerCase() ||
      (activeFilter === "Email" && false) || // No email templates
      (activeFilter === "Nurturing" && template.category === "nurturing") ||
      (activeFilter === "Onboarding" && template.category === "onboarding") ||
      (activeFilter === "Retention" && template.category === "retention")

    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setCurrentView("builder")
  }

  const handleBackToLibrary = () => {
    setCurrentView("library")
    setSelectedTemplate(null)
  }

  if (currentView === "builder" && selectedTemplate) {
    return (
      <div className="h-screen">
        <FlowBuilder initialTemplate={selectedTemplate} onBack={handleBackToLibrary} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
           <Button
  variant="ghost"
  size="sm"
  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
  onClick={() => navigate("/")}
>
  <ArrowLeft className="w-4 h-4" />
  <span className="text-sm font-medium">Back to Dashboard</span>
</Button>
            <div className="flex items-center gap-2 text-gray-400">
              <Copy className="w-4 h-4" />
              <span className="text-sm">Template Library</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Library</h1>
          <p className="text-gray-600">Start with proven marketing flows</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                className="pl-10 bg-white border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {filterTabs.map((tab) => (
                <Button
                  key={tab}
                  variant={activeFilter === tab ? "default" : "ghost"}
                  size="sm"
                  className={
                    activeFilter === tab
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-2">
                <Copy className="w-12 h-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">
                {activeFilter === "Email"
                  ? "No email templates are currently available."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Category Badge and Duration */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${template.categoryColor} border-0 text-xs font-medium px-2 py-1`}>
                      {template.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      </div>
                      <span>{template.duration}</span>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                    <span>{template.steps} steps</span>
                    <span>{template.connections} connections</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      
    </div>
  )
}
