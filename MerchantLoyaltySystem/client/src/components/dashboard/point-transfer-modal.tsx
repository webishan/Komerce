import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const pointTransferSchema = z.object({
  customerMobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  points: z.number().min(1, "Points must be at least 1"),
  description: z.string().optional(),
});

type PointTransferForm = z.infer<typeof pointTransferSchema>;

interface PointTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PointTransferModal({ isOpen, onClose }: PointTransferModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<PointTransferForm>({
    resolver: zodResolver(pointTransferSchema),
    defaultValues: {
      customerMobile: "",
      points: 0,
      description: "",
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: PointTransferForm) => {
      const response = await apiRequest("POST", "/api/points/transfer", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/points/transactions"] });
      
      toast({
        title: "Points transferred successfully!",
        description: `Earned ৳${data.cashbackEarned.toFixed(2)} in cashback`,
      });
      
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Transfer failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PointTransferForm) => {
    transferMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Points</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter customer's mobile number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the customer's mobile number to transfer points
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points to Transfer</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter points amount"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    You will earn 15% cashback on transferred points
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter transaction description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={transferMutation.isPending}
              >
                {transferMutation.isPending ? "Transferring..." : "Transfer Points"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
