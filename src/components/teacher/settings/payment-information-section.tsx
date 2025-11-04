"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { teacherProfileService } from "@/lib/teacher-profile-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CreditCard, Edit2, Plus, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema for payment information
const paymentMethodSchema = z.object({
  bankName: z
    .string()
    .min(1, "Bank name is required")
    .min(2, "Bank name must be at least 2 characters"),
  accountHolderName: z
    .string()
    .min(1, "Account holder name is required")
    .min(3, "Account holder name must be at least 3 characters")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Account holder name should only contain letters and spaces"
    ),
  bankAccount: z
    .string()
    .min(1, "Bank account number is required")
    .min(8, "Bank account number must be at least 8 characters")
    .regex(/^[0-9]+$/, "Bank account number should only contain numbers"),
  paymentMethod: z
    .string()
    .min(1, "Payment method is required")
    .min(2, "Payment method must be at least 2 characters"),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethod {
  _id?: string;
  bankName: string;
  accountHolderName: string;
  bankAccount: string;
  paymentMethod: string;
  isPrimary: boolean;
}

const defaultValues: PaymentMethodFormData = {
  bankName: "",
  accountHolderName: "",
  bankAccount: "",
  paymentMethod: "",
};

export function PaymentInformationSection() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues,
  });

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    try {
      const response = await teacherProfileService.getPaymentMethods();
      setPaymentMethods(response.paymentMethods || []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  useEffect(() => {
    isAuthenticated && fetchPaymentMethods();
  }, [isAuthenticated]);

  const onSubmit = async (data: PaymentMethodFormData) => {
    try {
      if (editingMethod) {
        // Update existing
        await teacherProfileService.updatePaymentMethod({
          paymentMethodId: editingMethod._id!,
          ...data,
        });
        toast({
          title: "Success",
          description: "Payment method updated successfully",
        });
      } else {
        // Add new
        await teacherProfileService.addPaymentMethod(data);
        toast({
          title: "Success",
          description: "Payment method added successfully",
        });
      }

      reset();
      setIsModalOpen(false);
      setEditingMethod(null);
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error saving payment method:", error);
      toast({
        title: "Error",
        description: "Failed to save payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    reset({
      bankName: method.bankName,
      accountHolderName: method.accountHolderName,
      bankAccount: method.bankAccount,
      paymentMethod: method.paymentMethod,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!methodToDelete) return;

    try {
      await teacherProfileService.deletePaymentMethod(methodToDelete._id!);
      toast({
        title: "Success",
        description: "Payment method deleted successfully",
      });
      fetchPaymentMethods();
      setDeleteDialogOpen(false);
      setMethodToDelete(null);
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (methodId: string) => {
    try {
      await teacherProfileService.setPrimaryPaymentMethod({
        paymentMethodId: methodId,
      });
      toast({
        title: "Success",
        description: "Primary payment method updated",
      });
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error setting primary payment method:", error);
      toast({
        title: "Error",
        description: "Failed to set primary payment method.",
        variant: "destructive",
      });
    }
  };

  const openAddModal = () => {
    setEditingMethod(null);
    reset(defaultValues);
    setIsModalOpen(true);
  };

  return (
    <Card className="border border-slate-200/70 shadow-xl shadow-slate-800/5 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-slate-500" />
          <CardTitle className="text-xl font-semibold">
            Payment Information
          </CardTitle>
        </div>
        {paymentMethods.length < 3 && (
          <Button onClick={openAddModal} size="sm" className="rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Bank
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 mb-6">
          Manage your payment methods (Maximum 3 banks allowed)
        </p>

        {/* Payment Methods List */}
        {paymentMethods.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white/60">
            <CreditCard className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 mb-4">No payment methods added yet</p>
            <Button onClick={openAddModal} className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Bank
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method._id}
                className={`relative mt-0 overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-xl ${
                  method.isPrimary
                    ? "bg-gradient-to-br from-blue-600 to-blue-800"
                    : "bg-gradient-to-br from-gray-700 to-gray-900"
                }`}>
                {/* Card Design */}
                <div className="p-6 text-white">
                  {/* Chip */}
                  <div className="absolute top-6 right-6">
                    <div className="w-12 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-8 pr-20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{method.bankName}</h3>
                        <p className="text-sm text-white/80">
                          {method.paymentMethod}
                        </p>
                      </div>
                    </div>
                    {method.isPrimary && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Primary
                      </span>
                    )}
                  </div>

                  {/* Card Number */}
                  <div className="mb-6">
                    <p className="text-xs text-white/60 mb-2">Card Number</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-2">
                        <div className="w-12 h-8 bg-white/20 rounded"></div>
                        <div className="w-12 h-8 bg-white/20 rounded"></div>
                        <div className="w-12 h-8 bg-white/20 rounded"></div>
                      </div>
                      <span className="font-mono text-xl tracking-wider">
                        {method.bankAccount.slice(-4)}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-white/60 mb-1">
                        Account Holder
                      </p>
                      <p className="font-semibold text-lg">
                        {method.accountHolderName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/60 mb-1">Valid</p>
                      <p className="font-semibold">•• / ••</p>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                </div>

                {/* Action Buttons - Overlay on hover */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                  {!method.isPrimary && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSetPrimary(method._id!)}
                      className="bg-white/90 hover:bg-white shadow-lg rounded-lg">
                      <Star className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(method)}
                    className="bg-white/90 hover:bg-white shadow-lg rounded-lg">
                    <Edit2 className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDeleteClick(method)}
                    className="bg-white/90 hover:bg-white shadow-lg rounded-lg">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>

                {/* Action Buttons - Always visible on mobile */}
                <div className="md:hidden p-4 bg-white/10 backdrop-blur-sm flex gap-2">
                  {!method.isPrimary && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSetPrimary(method._id!)}
                      className="flex-1 bg-white/90 hover:bg-white rounded-lg">
                      <Star className="h-4 w-4 text-blue-600 mr-2" />
                      Set Primary
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(method)}
                    className="flex-1 bg-white/90 hover:bg-white rounded-lg">
                    <Edit2 className="h-4 w-4 text-blue-600 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDeleteClick(method)}
                    className="flex-1 bg-white/90 hover:bg-white rounded-lg">
                    <Trash2 className="h-4 w-4 text-red-600 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>
                  {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="bankName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your bank name"
                            className="mt-1"
                            aria-invalid={errors.bankName ? "true" : "false"}
                          />
                        )}
                      />
                      {errors.bankName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.bankName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Account Holder Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="accountHolderName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter account holder name"
                            className="mt-1"
                            aria-invalid={
                              errors.accountHolderName ? "true" : "false"
                            }
                          />
                        )}
                      />
                      {errors.accountHolderName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.accountHolderName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bank Account Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="bankAccount"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your bank account number"
                            className="mt-1"
                            aria-invalid={errors.bankAccount ? "true" : "false"}
                          />
                        )}
                      />
                      {errors.bankAccount && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.bankAccount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Payment Method <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text"
                            placeholder="e.g., Bank Transfer, PayPal, etc."
                            className="mt-1"
                            aria-invalid={
                              errors.paymentMethod ? "true" : "false"
                            }
                          />
                        )}
                      />
                      {errors.paymentMethod && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.paymentMethod.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingMethod(null);
                        reset();
                      }}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                      disabled={isSubmitting}>
                      {isSubmitting
                        ? "Saving..."
                        : editingMethod
                        ? "Update"
                        : "Add"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Delete Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the payment method for{" "}
              <strong>{methodToDelete?.bankName}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setMethodToDelete(null);
              }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
