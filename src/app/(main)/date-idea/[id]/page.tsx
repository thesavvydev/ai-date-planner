import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { DATE_CATEGORIES } from "@/schema/dateIdea";
import { ArrowLeft, Calendar, Car, Clock, DollarSign, ExternalLink, MapPin, Phone, Star, Umbrella, Users } from "lucide-react";
import Link from "next/link";

// For type safety, define types for the mapped arrays
interface SuggestedLocation {
  name: string;
  address: string;
  description: string;
  website?: string;
  phone?: string;
}
interface Alternative {
  title: string;
  description: string;
  why: string;
}

export default async function DateIdeaPage({ 
  params
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const numericId = Number(id);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("date_ideas")
    .select("*")
    .eq("id", numericId)
    .single();

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Date Idea Not Found</h1>
          <p className="text-gray-600 mb-6">The date idea details could not be loaded.</p>
          {error && <p className="text-gray-600 mb-6">{error.message}</p>}
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
                <span className="text-4xl">{DATE_CATEGORIES[data.date_idea.category as keyof typeof DATE_CATEGORIES]?.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{data.date_idea.title}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-medium">{data.date_idea.rating}</span>
                    </div>
                    <Badge className="bg-pink-100 text-pink-700">
                      {data.date_idea.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{data.date_idea.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{data.date_idea.cost}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{data.date_idea.location}</span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {data.date_idea.detailedDescription}
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
              <p className="text-gray-700 mb-4">{data.date_idea.exactLocation}</p>
              
              <h4 className="font-semibold text-gray-800 mb-3">Suggested Venues</h4>
              <div className="space-y-4">
                {(data.date_idea.suggestedLocations as SuggestedLocation[]).map((location: SuggestedLocation, index: number) => (
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
                  {(data.date_idea.whatToBring as string[]).map((item: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What to Wear</h4>
                <p className="text-gray-700">{data.date_idea.whatToWear}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Best Time</h4>
                <p className="text-gray-700">{data.date_idea.bestTime}</p>
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
                {(data.date_idea.tips as string[]).map((tip: string, index: number) => (
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
                {(data.date_idea.alternatives as Alternative[]).map((alt: Alternative, index: number) => (
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
                  <span className="font-medium">{data.date_idea.costBreakdown.mainActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Food & Drinks</span>
                  <span className="font-medium">{data.date_idea.costBreakdown.food}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transportation</span>
                  <span className="font-medium">{data.date_idea.costBreakdown.transportation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Extras</span>
                  <span className="font-medium">{data.date_idea.costBreakdown.extras}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-pink-600">{data.date_idea.costBreakdown.total}</span>
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
                <p className="text-gray-700 text-sm">{data.date_idea.reservations}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Parking
                </h4>
                <p className="text-gray-700 text-sm">{data.date_idea.parking}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Umbrella className="w-4 h-4" />
                  Weather Considerations
                </h4>
                <p className="text-gray-700 text-sm">{data.date_idea.weatherConsiderations}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Accessibility
                </h4>
                <p className="text-gray-700 text-sm">{data.date_idea.accessibility}</p>
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