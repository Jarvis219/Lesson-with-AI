"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VocabList } from "@/types/vocab";

interface ListsTableProps {
  items: VocabList[];
  loading?: boolean;
}

export function ListsTable({ items, loading }: ListsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Words</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={(item as any)._id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="text-gray-600">{item.description || "-"}</TableCell>
            <TableCell>{(item as any).vocabularyCount || 0}</TableCell>
            <TableCell className="text-gray-500">{item.slug}</TableCell>
            <TableCell>{(item as any).isActive ? "Active" : "Inactive"}</TableCell>
          </TableRow>
        ))}
        {!loading && items.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-500">
              No data
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default ListsTable;


