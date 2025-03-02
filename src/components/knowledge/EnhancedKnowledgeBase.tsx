import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface KnowledgeResource {
  id: string;
  title: string;
  url: string;
  category: string;
  relevance?: number;
  dateAdded: string;
}

export function EnhancedKnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [resources, setResources] = useState<KnowledgeResource[]>([
    {
      id: "1",
      title: "React Documentation",
      url: "https://reactjs.org/docs/getting-started.html",
      category: "Frontend",
      relevance: 0.9,
      dateAdded: "2023-01-01",
    },
    {
      id: "2",
      title: "Node.js Documentation",
      url: "https://nodejs.org/en/docs/",
      category: "Backend",
      relevance: 0.8,
      dateAdded: "2023-02-15",
    },
    {
      id: "3",
      title: "PostgreSQL Documentation",
      url: "https://www.postgresql.org/docs/",
      category: "Database",
      relevance: 0.7,
      dateAdded: "2023-03-10",
    },
    {
      id: "4",
      title: "Docker Documentation",
      url: "https://docs.docker.com/",
      category: "DevOps",
      relevance: 0.6,
      dateAdded: "2023-04-05",
    },
    {
      id: "5",
      title: "UX Design Principles",
      url: "https://www.interaction-design.org/literature/topics/ux-design",
      category: "UX",
      relevance: 0.5,
      dateAdded: "2023-05-01",
    },
  ]);

  // Fix the TypeScript error in the sort function
  const sortedResources = [...resources].sort((a, b) => {
    if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    } else if (sortBy === "relevance") {
      // Convert relevance scores to numbers for comparison
      return (b.relevance || 0) - (a.relevance || 0);
    } else if (sortBy === "date") {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
    return 0;
  });

  const filteredResources = sortedResources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Knowledge Base</CardTitle>
          <CardDescription>
            Centralized repository of project-related resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Resources</Label>
            <Input
              type="search"
              id="search"
              placeholder="Enter search term"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="date">Date Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableCaption>
              A list of your project resources.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Relevance</TableHead>
                <TableHead>Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {resource.title}
                    </a>
                  </TableCell>
                  <TableCell>{resource.category}</TableCell>
                  <TableCell>
                    {resource.relevance ? (
                      <Badge variant="secondary">
                        {Math.round(resource.relevance * 100)}%
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{resource.dateAdded}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Categories</CardTitle>
          <CardDescription>
            Explore resources by category for targeted information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="frontend">
              <AccordionTrigger>Frontend Resources</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5">
                  {resources
                    .filter((resource) => resource.category === "Frontend")
                    .map((resource) => (
                      <li key={resource.id}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="backend">
              <AccordionTrigger>Backend Resources</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5">
                  {resources
                    .filter((resource) => resource.category === "Backend")
                    .map((resource) => (
                      <li key={resource.id}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="database">
              <AccordionTrigger>Database Resources</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5">
                  {resources
                    .filter((resource) => resource.category === "Database")
                    .map((resource) => (
                      <li key={resource.id}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="devops">
              <AccordionTrigger>DevOps Resources</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5">
                  {resources
                    .filter((resource) => resource.category === "DevOps")
                    .map((resource) => (
                      <li key={resource.id}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ux">
              <AccordionTrigger>UX Resources</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5">
                  {resources
                    .filter((resource) => resource.category === "UX")
                    .map((resource) => (
                      <li key={resource.id}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {resource.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
