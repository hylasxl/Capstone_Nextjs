"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { DisplayAccount, GetAccountInfoRequest, GetAccountInfoResponse } from "@/types/user.type";
import { useAuth } from "@/hooks/useAuth";
import { UserService } from "@/services/userService";
import { GetListFriendRequest } from "@/types/friend.type";
import { friendService } from "@/services/friendService";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { CreatePostRequest, DisplayPost, GetNewFeedRequest } from "@/types/post.type";
import { PostService } from "@/services/postService";
import DisplayPostComponent from "@/components/post/DisplayPost";

export default function NewFeed() {
    const [postContent, setPostContent] = useState("");
    const [privacy, setPrivacy] = useState("public");
    const [publishDate, setPublishDate] = useState<Date | undefined>();
    const [publishTime, setPublishTime] = useState<string>("12:00");
    const [currentAccountData, setCurrentAccountData] = useState<GetAccountInfoResponse>();
    const [listFriend, setListFriend] = useState<DisplayAccount[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<DisplayAccount[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [post, setPosts] = useState<DisplayPost[]>([])
    const [postPage, setPostPage] = useState<number>(1)
    const [seenPostID, setSeenPostID] = useState<number[]>([])
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isLoadMorePost, setIsLoadMorePost] = useState<boolean>(false)

    const observer = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const postPageSize = 10

    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        const getUserData = async () => {
            const request: GetAccountInfoRequest = { account_id: user.id };
            try {
                const response = await UserService.getUserData(request);
                setCurrentAccountData(response);
            } catch (e) {
                console.error(e);
            }
        };
        getUserData();
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const getListFriend = async () => {
            const request: GetListFriendRequest = { account_id: user.id.toString() };
            try {
                const response = await friendService.getListFriend(request);
                if (response.success) {
                    setListFriend(response.Infos);
                }
            } catch (e) {
                console.error(e);
            }
        };
        getListFriend();
    }, [user]);

    useEffect(() => {
        if (!user || !hasMore || isLoadMorePost) return;

        const getNewFeeds = async () => {
            try {
                const request: GetNewFeedRequest = {
                    account_id: user.id,
                    page: postPage,
                    page_size: postPageSize,
                    seen_post_id: seenPostID
                };

                setIsLoadMorePost(true)

                const response = await PostService.getNewFeed(request);

                if (response.posts.length == 0) setHasMore(false);

                setPosts((prev) => {
                    const existingPostIds = new Set(prev.map((p) => p.post_id));
                    const uniquePosts = response.posts.filter((p) => !existingPostIds.has(p.post_id));
                    return [...prev, ...uniquePosts];
                });
                setSeenPostID((prev) => [...new Set([...prev, ...response.posts.map((item) => item.post_id)])]);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoadMorePost(false)
            }
        };

        getNewFeeds();
    }, [postPage, user]);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        observer.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore) {
                    setPostPage((prev) => prev + 1);
                }
            },
            {
                rootMargin: "200px",
            }
        );

        if (loadMoreRef.current) {
            observer.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observer.current && loadMoreRef.current) {
                observer.current.unobserve(loadMoreRef.current);
            }
        };
    }, [hasMore]);

    const toggleFriendSelection = (friend: DisplayAccount) => {
        setSelectedFriends((prev) => {
            if (prev.find(f => f.AccountID === friend.AccountID)) {
                return prev.filter(f => f.AccountID !== friend.AccountID);
            } else {
                return [...prev, friend];
            }
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        let files = Array.from(event.target.files);

        if (selectedImages.length + files.length > 10) {
            files = files.slice(0, 10 - selectedImages.length);
        }

        setSelectedImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCreatePost = async () => {
        if (user == null) return;
        if (!postContent.trim().length && !selectedImages.length) return;

        setIsLoading(true);

        const tagIDs = selectedFriends.map(item => item.AccountID).join(",");

        let publishTimestamp = "";
        if (publishDate) {
            const [hours, minutes] = publishTime.split(":").map(Number);
            const combinedDate = new Date(publishDate);
            combinedDate.setHours(hours, minutes, 0, 0);
            publishTimestamp = Math.floor(combinedDate.getTime() / 1000).toString();
        }

        const request: CreatePostRequest = {
            account_id: user.id.toString(),
            content: postContent.trim(),
            is_published_later: publishDate ? "true" : "false",
            published_later_timestamp: publishTimestamp,
            tag_account_ids: tagIDs,
            images: selectedImages,
            privacy_status: privacy
        };

        try {
            const response = await PostService.createPost(request);
            console.log(response.media_urls);

            // Reset all fields after successful post
            setPostContent("");
            setSelectedImages([]);
            setSelectedFriends([]);
            setPublishDate(undefined);
            setPublishTime("12:00");
            setPrivacy("public");

            // Close the dialog
            setDialogOpen(false);
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-2xl">
                <Card className="mb-4 mt-10">
                    <CardHeader className="grid grid-cols-[auto,1fr] gap-4 p-4">
                        <Avatar>
                            <AvatarImage src={currentAccountData?.account_avatar.avatar_url} alt="User Avatar" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full text-left">What&apos;s on your mind?</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Post</DialogTitle>
                                </DialogHeader>

                                <div className="grid grid-cols-2 gap-4">
                                    <Select value={privacy} onValueChange={setPrivacy}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Privacy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">🌍 Public</SelectItem>
                                            <SelectItem value="friend_only">👥 Friends Only</SelectItem>
                                            <SelectItem value="private">🔒 Private</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full">
                                                {publishDate ? format(publishDate, "PPP") : "📅 Select Date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="start">
                                            <Calendar mode="single" selected={publishDate} onSelect={setPublishDate} />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {publishDate && (
                                    <div className="mt-4">
                                        <Select value={publishTime} onValueChange={setPublishTime}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 24 }, (_, hour) =>
                                                    ["00", "30"].map((minute) => (
                                                        <SelectItem key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
                                                            {`${hour.toString().padStart(2, "0")}:${minute}`}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <Textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="What's on your mind?" className="w-full p-2 border rounded mt-4" />

                                <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="cursor-pointer" />

                                {/* Image Previews (Max 4 shown) */}
                                {selectedImages.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                                        {selectedImages.slice(0, 4).map((file, index) => {
                                            const imageUrl = URL.createObjectURL(file);
                                            const isLastVisible = index === 3 && selectedImages.length > 4;

                                            return (
                                                <Card key={index} className="relative group overflow-hidden">
                                                    {/* Delete Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="w-4 h-4 text-red-500" />
                                                    </Button>

                                                    {/* Image Display */}
                                                    <CardContent className="p-0">
                                                        <AspectRatio ratio={1}>
                                                            <Image
                                                                src={imageUrl}
                                                                alt={`Preview ${index + 1}`}
                                                                fill
                                                                className="object-cover rounded-lg"
                                                                unoptimized
                                                            />
                                                        </AspectRatio>
                                                    </CardContent>

                                                    {/* "+X More" Overlay */}
                                                    {isLastVisible && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                                            <span className="text-white text-xl font-bold">
                                                                +{selectedImages.length - 4}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Image Count Notice */}
                                <p className="text-sm text-gray-500">{selectedImages.length}/10 images selected</p>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="mt-4">Tag Friends</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Select Friends to Tag</DialogTitle>
                                        </DialogHeader>
                                        <div className="max-h-60 overflow-y-auto">
                                            {listFriend.map(friend => (
                                                <div key={friend.AccountID} className="flex items-center gap-2 p-2 border-b">
                                                    <Avatar>
                                                        <AvatarImage src={friend.AvatarURL} alt={friend.DisplayName} />
                                                        <AvatarFallback>{friend.DisplayName[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{friend.DisplayName}</span>
                                                    <Button variant="outline" size="sm" onClick={() => toggleFriendSelection(friend)}>
                                                        {selectedFriends.some(f => f.AccountID === friend.AccountID) ? "Unselect" : "Select"}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Button onClick={handleCreatePost} className="w-full mt-4"> {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        Posting...
                                    </span>
                                ) : "Post"}</Button>
                                <DialogDescription>Share your thoughts with your friends and the world.</DialogDescription>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                </Card>
                <Separator className="my-4" />
                {post && post.length > 0 ? (
                    post.map((item) => (
                        <div key={item.post_id} >
                            <DisplayPostComponent post={item} />
                            <div className="mt-4"></div>
                        </div>
                    ))
                ) : (
                    <p></p>
                )}
                <div className="flex justify-center items-center w-full">
                    {isLoadMorePost ? (
                        <span className="flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                            Loading...
                        </span>
                    ) : ""}
                </div>
                <div ref={loadMoreRef}></div>
            </div>
        </div>
    );
}