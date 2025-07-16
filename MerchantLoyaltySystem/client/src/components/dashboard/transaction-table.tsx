import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Transaction {
  id: number;
  createdAt: string;
  transactionType: string;
  points?: number;
  amount?: string;
  description?: string;
  status: string;
  customerMobile?: string;
  cashbackType?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  title: string;
  loading?: boolean;
}

export default function TransactionTable({ transactions, title, loading = false }: TransactionTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "transfer":
        return "bg-blue-100 text-blue-800";
      case "purchase":
        return "bg-purple-100 text-purple-800";
      case "instant_15":
        return "bg-green-100 text-green-800";
      case "referral_2":
        return "bg-orange-100 text-orange-800";
      case "royalty_1":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-sm">
                    {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(transaction.transactionType || transaction.cashbackType || "")}>
                      {transaction.transactionType || transaction.cashbackType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.points || "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.amount ? `৳${transaction.amount}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {transaction.description || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
