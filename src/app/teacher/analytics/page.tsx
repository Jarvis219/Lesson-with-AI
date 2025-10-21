"use client";

import {
  ProgressChart,
  SkillRadarChart,
  WeeklyProgressChart,
} from "@/components/charts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgressAnalyticsPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Progress & Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track learning progress and performance analytics
        </p>
      </div>

      {/* Weekly Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <WeeklyProgressChart data={[]} />
          </div>
        </CardContent>
      </Card>

      {/* Skill Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Skill Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <SkillRadarChart
                data={{
                  grammar: 100,
                  vocab: 100,
                  listening: 100,
                  speaking: 100,
                  reading: 100,
                  writing: 100,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ProgressChart data={[]} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics - To be implemented */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Detailed analytics and insights will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
