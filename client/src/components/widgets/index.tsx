"use client";

import { Card, CardTitle } from "@/components/ui/card";
import React from "react";


export interface WidgetDataProps {
    name: string, 
    value: number | string,
    icon: React.ReactNode
    className: string,
}

export const Widget = ({ icon, name, value, className }: WidgetDataProps) => {
    return (
            <Card className="w-full bg-white shadow-md rounded-lg  flex items-center gap-4 p-4">
                <div className={`rounded-lg p-3 w-12 h-12 flex items-center justify-center ${className}`}>
                    {icon}
                </div>
                <div className="flex flex-col items-start gap-1">
                    <CardTitle className="font-normal text-sm text-muted-foreground">{name}</CardTitle>
                    <p className="text-lg font-medium"> {value} </p>
                </div>
            </Card>
    );
}