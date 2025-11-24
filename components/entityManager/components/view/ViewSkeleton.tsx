/**
 * ViewSkeleton Component
 * 
 * Skeleton loader for EntityView loading states.
 */

'use client';

import React from 'react';

interface ViewSkeletonProps {
    mode?: 'detail' | 'card' | 'profile';
    groupCount?: number;
}

export function ViewSkeleton({ mode = 'detail', groupCount = 3 }: ViewSkeletonProps) {
    if (mode === 'card') {
        return <CardSkeleton />;
    }

    if (mode === 'profile') {
        return <ProfileSkeleton groupCount={groupCount} />;
    }

    return <DetailSkeleton groupCount={groupCount} />;
}

function DetailSkeleton({ groupCount }: { groupCount: number }) {
    return (
        <div className="space-y-4 sm:space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b">
                <div className="h-8 bg-muted rounded w-48"></div>
                <div className="flex gap-2">
                    <div className="h-9 bg-muted rounded w-20"></div>
                    <div className="h-9 bg-muted rounded w-20"></div>
                </div>
            </div>

            {/* Groups */}
            {Array.from({ length: groupCount }).map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-muted/50">
                        <div className="h-5 bg-muted rounded w-40"></div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-3 bg-card">
                        {Array.from({ length: 4 }).map((_, j) => (
                            <div key={j} className="flex flex-col sm:flex-row items-start py-1.5 sm:py-2 gap-1 sm:gap-0">
                                <div className="w-full sm:w-1/3 sm:pr-4">
                                    <div className="h-4 bg-muted rounded w-24"></div>
                                </div>
                                <div className="w-full sm:w-2/3">
                                    <div className="h-4 bg-muted rounded w-full max-w-xs"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-video w-full bg-muted"></div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                    <div className="h-7 bg-muted rounded w-48 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-64"></div>
                </div>
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="h-4 bg-muted rounded w-24"></div>
                            <div className="h-4 bg-muted rounded flex-1 max-w-xs"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProfileSkeleton({ groupCount }: { groupCount: number }) {
    return (
        <div className="space-y-4 sm:space-y-6 animate-pulse">
            {/* Profile Header */}
            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted"></div>
                        <div className="flex-1 text-center sm:text-left space-y-2">
                            <div className="h-7 bg-muted rounded w-48 mx-auto sm:mx-0"></div>
                            <div className="h-4 bg-muted rounded w-64 mx-auto sm:mx-0"></div>
                        </div>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 border-t">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col">
                            <div className="h-3 bg-muted rounded w-20 mb-1"></div>
                            <div className="h-4 bg-muted rounded w-32"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Groups */}
            {Array.from({ length: groupCount }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border shadow-sm overflow-hidden">
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-muted/50">
                        <div className="h-5 bg-muted rounded w-40"></div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2">
                        {Array.from({ length: 3 }).map((_, j) => (
                            <div key={j} className="flex items-start py-2 gap-2">
                                <div className="w-1/3">
                                    <div className="h-4 bg-muted rounded w-24"></div>
                                </div>
                                <div className="w-2/3">
                                    <div className="h-4 bg-muted rounded w-full max-w-xs"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
