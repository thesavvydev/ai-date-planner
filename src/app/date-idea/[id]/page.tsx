import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DATE_CATEGORIES } from "@/schema/dateIdea";
import { ArrowLeft, Clock, MapPin, Star, ExternalLink, Phone, Calendar, Car, Umbrella, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const detailedDateIdeaSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  location: z.string(),
  duration: z.string(),
  cost: z.string(),
  rating: z.number(),
  description: z.string(),
  detailedDescription: z.string().describe("A comprehensive description of the date idea with all the details"),
  exactLocation: z.string().describe("The exact address or specific location details"),
  suggestedLocations: z.array(z.object({
    name: z.string(),
    address: z.string(),
    description: z.string(),
    website: z.string().optional(),
    phone: z.string().optional(),
  })).describe("List of specific venue suggestions for this date idea"),
  whatToBring: z.array(z.string()).describe("Items to bring for this date"),
  whatToWear: z.string().describe("Suggested attire for this date"),
  bestTime: z.string().describe("Best time of day or season for this date"),
  tips: z.array(z.string()).describe("Helpful tips for making this date successful"),
  alternatives: z.array(z.object({
    title: z.string(),
    description: z.string(),
    why: z.string(),
  })).describe("Alternative options if the main idea doesn't work out"),
  costBreakdown: z.object({
    mainActivity: z.string(),
    food: z.string(),
    transportation: z.string(),
    extras: z.string(),
    total: z.string(),
  }).describe("Detailed cost breakdown"),
  weatherConsiderations: z.string().describe("How weather might affect this date"),
  accessibility: z.string().describe("Accessibility considerations"),
  parking: z.string().describe("Parking information"),
  reservations: z.string().describe("Whether reservations are needed and how to make them"),
});

type DetailedDateIdea = z.infer<typeof detailedDateIdeaSchema>;

async function getDetailedDateIdea(id: string): Promise<DetailedDateIdea> {
  const result = await generateObject({
    model: openai("gpt-4o"),
    prompt: `Generate detailed information for a date idea with ID: ${id}. 
    
    Please create a comprehensive date idea with the following ID: ${id}.
    Generate a unique and engaging date experience that would be perfect for couples.
    
    Please provide comprehensive details including exact locations, specific venue suggestions, what to bring, what to wear, tips, and alternatives.`,
    schema: detailedDateIdeaSchema,
  });
  
  return result.object;
}

export default async function DateIdeaPage({ 
  params
}: { 
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let detailedDateIdea: DetailedDateIdea;
  try {
    detailedDateIdea = await getDetailedDateIdea(id);
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Date Idea Not Found</h1>
          <p className="text-gray-600 mb-6">The date idea details could not be loaded.</p>
          {error instanceof Error && <p className="text-gray-600 mb-6">{error.message}</p>}
          <Link href="/">
            <Button className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Date Ideas
          </Button>
        </Link>
        
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{DATE_CATEGORIES[detailedDateIdea.category as keyof typeof DATE_CATEGORIES]?.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{detailedDateIdea.title}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-medium">{detailedDateIdea.rating}</span>
                    </div>
                    <Badge className="bg-pink-100 text-pink-700">
                      {detailedDateIdea.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{detailedDateIdea.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{detailedDateIdea.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{detailedDateIdea.location}</span>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                {detailedDateIdea.detailedDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Exact Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Exact Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{detailedDateIdea.exactLocation}</p>
              
              <h4 className="font-semibold text-gray-800 mb-3">Suggested Venues</h4>
              <div className="space-y-4">
                {detailedDateIdea.suggestedLocations.map((location, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-2">{location.name}</h5>
                    <p className="text-gray-600 text-sm mb-2">{location.address}</p>
                    <p className="text-gray-700 mb-3">{location.description}</p>
                    <div className="flex gap-2">
                      {location.website && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={location.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Website
                          </a>
                        </Button>
                      )}
                      {location.phone && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${location.phone}`}>
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What to Bring & Wear */}
          <Card>
            <CardHeader>
              <CardTitle>What to Bring & Wear</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">What to Bring</h4>
                <div className="flex flex-wrap gap-2">
                  {detailedDateIdea.whatToBring.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What to Wear</h4>
                <p className="text-gray-700">{detailedDateIdea.whatToWear}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Best Time</h4>
                <p className="text-gray-700">{detailedDateIdea.bestTime}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {detailedDateIdea.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Alternatives */}
          <Card>
            <CardHeader>
              <CardTitle>Alternative Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detailedDateIdea.alternatives.map((alt, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-2">{alt.title}</h5>
                    <p className="text-gray-700 mb-2">{alt.description}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Why this works:</span> {alt.why}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Main Activity</span>
                  <span className="font-medium">{detailedDateIdea.costBreakdown.mainActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Food & Drinks</span>
                  <span className="font-medium">{detailedDateIdea.costBreakdown.food}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transportation</span>
                  <span className="font-medium">{detailedDateIdea.costBreakdown.transportation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Extras</span>
                  <span className="font-medium">{detailedDateIdea.costBreakdown.extras}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-pink-600">{detailedDateIdea.costBreakdown.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practical Info */}
          <Card>
            <CardHeader>
              <CardTitle>Practical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Reservations
                </h4>
                <p className="text-gray-700 text-sm">{detailedDateIdea.reservations}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Parking
                </h4>
                <p className="text-gray-700 text-sm">{detailedDateIdea.parking}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Umbrella className="w-4 h-4" />
                  Weather Considerations
                </h4>
                <p className="text-gray-700 text-sm">{detailedDateIdea.weatherConsiderations}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Accessibility
                </h4>
                <p className="text-gray-700 text-sm">{detailedDateIdea.accessibility}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600">
              Save to Favorites
            </Button>
            <Button variant="outline" className="w-full">
              Share This Date Idea
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 