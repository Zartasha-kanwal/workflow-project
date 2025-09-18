import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, Users, Mail, MessageSquare, Calendar, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Templates = () => {
  const navigate = useNavigate();

  const templates = [
    {
      id: 1,
      title: "Welcome Email Series",
      description: "Automatically send a series of welcome emails to new subscribers",
      category: "Email Marketing",
      icon: Mail,
      rating: 4.8,
      uses: 1240,
      nodes: [
        { type: "trigger", title: "New Subscriber" },
        { type: "delay", title: "Wait 1 day" },
        { type: "email", title: "Welcome Email" },
        { type: "delay", title: "Wait 3 days" },
        { type: "email", title: "Getting Started Tips" }
      ]
    },
    {
      id: 2,
      title: "Lead Nurturing Campaign",
      description: "Nurture leads through targeted content and follow-ups",
      category: "Lead Generation",
      icon: Target,
      rating: 4.9,
      uses: 890,
      nodes: [
        { type: "trigger", title: "Lead Form Submit" },
        { type: "email", title: "Thank You Email" },
        { type: "delay", title: "Wait 2 days" },
        { type: "condition", title: "Email Opened?" },
        { type: "email", title: "Follow-up Email" }
      ]
    },
    {
      id: 3,
      title: "Customer Onboarding",
      description: "Guide new customers through your product or service",
      category: "Customer Success",
      icon: Users,
      rating: 4.7,
      uses: 650,
      nodes: [
        { type: "trigger", title: "New Customer" },
        { type: "email", title: "Welcome & Setup Guide" },
        { type: "task", title: "Schedule Onboarding Call" },
        { type: "delay", title: "Wait 7 days" },
        { type: "sms", title: "Check-in Message" }
      ]
    },
    {
      id: 4,
      title: "Event Registration Follow-up",
      description: "Manage event registrations and send reminders",
      category: "Event Management",
      icon: Calendar,
      rating: 4.6,
      uses: 420,
      nodes: [
        { type: "trigger", title: "Event Registration" },
        { type: "email", title: "Confirmation Email" },
        { type: "delay", title: "Wait 1 week before event" },
        { type: "email", title: "Event Reminder" },
        { type: "delay", title: "Wait 1 day after event" },
        { type: "email", title: "Thank You & Feedback" }
      ]
    },
    {
      id: 5,
      title: "Re-engagement Campaign",
      description: "Win back inactive customers with targeted messaging",
      category: "Customer Retention",
      icon: MessageSquare,
      rating: 4.5,
      uses: 780,
      nodes: [
        { type: "trigger", title: "Inactive Customer" },
        { type: "email", title: "We Miss You Email" },
        { type: "delay", title: "Wait 5 days" },
        { type: "condition", title: "Email Opened?" },
        { type: "email", title: "Special Offer" },
        { type: "sms", title: "Final Attempt" }
      ]
    },
    {
      id: 6,
      title: "Product Demo Request",
      description: "Automate demo scheduling and follow-up process",
      category: "Sales",
      icon: Target,
      rating: 4.8,
      uses: 550,
      nodes: [
        { type: "trigger", title: "Demo Request" },
        { type: "email", title: "Demo Confirmation" },
        { type: "task", title: "Schedule Demo" },
        { type: "delay", title: "Wait 1 day after demo" },
        { type: "email", title: "Demo Follow-up" }
      ]
    }
  ];

  const handleUseTemplate = (template: any) => {
    toast({
      title: "Template Loaded",
      description: `${template.title} template has been loaded in the flow builder.`,
    });
    
    // Navigate to flow builder with template data
    navigate('/flow-builder', { state: { template } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/workflows')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Workflows
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Workflow Templates</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Get started quickly with pre-built workflow templates
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const IconComponent = template.icon;
            return (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            {template.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{template.uses} uses</span>
                    </div>
                  </div>

                  {/* Flow Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Flow Steps:</h4>
                    <div className="space-y-1">
                      {template.nodes.slice(0, 3).map((node, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">{node.title}</span>
                        </div>
                      ))}
                      {template.nodes.length > 3 && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                          <span className="text-muted-foreground">
                            +{template.nodes.length - 3} more steps
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleUseTemplate(template)}
                    className="w-full group-hover:bg-primary/90"
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Custom Template CTA */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Need a Custom Template?</h3>
                <p className="text-muted-foreground">
                  Can't find what you're looking for? Create your own workflow from scratch.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/flow-builder')}
                variant="outline" 
                className="gap-2"
              >
                <Target className="h-4 w-4" />
                Create Custom Workflow
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Templates;