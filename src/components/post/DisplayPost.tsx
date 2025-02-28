"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { DisplayPost, SharePostDataDisplay } from "@/types/post.type";
import Image from "next/image";

interface DisplayPostProps {
    post: DisplayPost;
}

const DisplayPostComponent: React.FC<DisplayPostProps> = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [showCommentDialog, setShowCommentDialog] = useState(false);

    const [commentPage, setCommentPage] = useState<number>(1)

    const commentPageSize = 20

    const handleLikeToggle = () => {
        setLiked((prev) => !prev)
        post.reactions.total_quantity += liked ? -1 : +1
    };
    const handleCommentDialogOpen = () => setShowCommentDialog(true);
    const handleCommentDialogClose = () => setShowCommentDialog(false);

    useEffect(() => {
        setLiked(post.interaction_type.length > 0)
    }, [post])

    const renderSharePost = (sharePostData: SharePostDataDisplay | undefined) => {
        if (!post.is_shared || !sharePostData) return null;
        return (
            <Card className="mt-4 border border-gray-300 p-4 bg-gray-100">
                <CardHeader className="flex items-left space-x-3">
                    <Avatar>
                        <AvatarImage src={sharePostData.account.avatar_url} alt={sharePostData.account.display_name} />
                        <AvatarFallback>{sharePostData.account.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="text-md font-semibold">{sharePostData.account.display_name}</h4>
                        <p className="text-xs text-gray-500">
                            {format(new Date(sharePostData.created_at * 1000), "PPPppp")}
                        </p>
                        <p className="text-sm text-gray-500">{sharePostData.privacy_status.toLocaleUpperCase()}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{sharePostData.content}</p>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex items-left justify-between">
                    <div className="flex items-left space-x-4">
                        <Avatar>
                            <AvatarImage src={post.account.avatar_url} alt={post.account.display_name} />
                            <AvatarFallback>{post.account.display_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{post.account.display_name}</h3>
                            <p className="text-sm text-gray-500">
                                {format(new Date(post.created_at * 1000), "PPPppp")}
                            </p>
                            <p className="text-sm text-gray-500">{post.privacy_status.toLocaleUpperCase()}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <p>{post.content}</p>
                    {renderSharePost(post.share_post_data)}
                    {post.medias.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-3 relative">
                            {post.medias.slice(0, 4).map((media, index) => (
                                <div key={media.media_id} className="relative aspect-square overflow-hidden rounded-lg">
                                    <Image src={media.url} alt={media.content} width={100} height={100} className="w-full h-full object-cover" />
                                    {index === 3 && post.medias.length > 4 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
                                            +{post.medias.length - 4}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between items-center mt-4 border-t pt-2">
                    <div className="flex space-x-4">
                        <Tooltip>
                            <Button
                                variant={liked ? "default" : "outline"}
                                size="sm"
                                onClick={handleLikeToggle}
                                className="relative"

                            >
                                Like

                            </Button>
                        </Tooltip>

                        <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={handleCommentDialogOpen}>
                                    Comment
                                </Button>
                            </DialogTrigger>
                            <DialogContent aria-description="Add comment">
                                <DialogTitle></DialogTitle>


                                <DialogFooter>

                                    <input className="w-full p-2 border rounded-md" placeholder="Write your comment..."></input>

                                    <Button variant="default" onClick={handleCommentDialogClose}>Post Comment</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm">Share</Button>
                    </div>
                    <div className="flex space-x-4 text-sm text-gray-600">
                        <span>{post.reactions.total_quantity} Reactions</span>
                        <span>{post.comment_quantity.total_quantity} Comments</span>
                        <span>{post.shares.total_quantity} Shares</span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default DisplayPostComponent;