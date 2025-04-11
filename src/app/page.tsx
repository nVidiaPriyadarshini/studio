"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateConversionRate } from "@/ai/flows/update-conversion-rate";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ArrowLeftRight } from "lucide-react";

const currencyOptions = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "KRW", label: "KRW - South Korean Won" },
];

export default function Home() {
  const [amount, setAmount] = useState<number | undefined>(1);
  const [fromCurrency, setFromCurrency] = useState(currencyOptions[0].value);
  const [toCurrency, setToCurrency] = useState(currencyOptions[1].value);
  const [convertedAmount, setConvertedAmount] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const convertCurrency = async () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateConversionRate({
        sourceCurrency: fromCurrency,
        targetCurrency: toCurrency,
      });
      setConvertedAmount(amount * result.rate);
      toast({
        title: "Success",
        description: "Currency conversion successful.",
      });
    } catch (error: any) {
      console.error("Currency conversion error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to convert currency.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const targetCurrencyLabel = currencyOptions.find(option => option.value === toCurrency)?.label.split(' - ')[0];

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Toaster />
      <Card className="w-full max-w-md bg-light-gray rounded-lg shadow-md p-4">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2 border-b">
          <CardTitle className="text-lg font-semibold text-primary">SwiftConvert</CardTitle>
          <CardDescription className="text-muted-foreground">
            Convert currencies quickly and easily.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromCurrency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="fromCurrency">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toCurrency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="toCurrency">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" size="icon" onClick={swapCurrencies}>
              <ArrowLeftRight className="h-4 w-4" />
              <span className="sr-only">Swap currencies</span>
            </Button>
          </div>
          <Button className="w-full bg-calming-blue text-white hover:bg-blue-700" onClick={convertCurrency} disabled={isLoading}>
            {isLoading ? "Converting..." : "Convert"}
          </Button>
          {convertedAmount !== undefined && (
            <div className="mt-4 text-center">
              <Label className="text-muted-foreground">Converted Amount</Label>
              <div className="text-2xl font-bold text-green-500">
                {new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: toCurrency,
                }).format(convertedAmount)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


