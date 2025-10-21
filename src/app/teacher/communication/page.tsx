"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, MessageSquare, Users } from "lucide-react";

export default function CommunicationPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
        <p className="mt-1 text-sm text-gray-500">
          Interact with your students through messages, comments, and forums
        </p>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="forum" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Class Forum
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Direct messaging system will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Lesson and course comments will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forum">
          <Card>
            <CardHeader>
              <CardTitle>Class Forum</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Class discussion forum will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
