"use client";

import { useEffect, useState } from "react";
import { ModerationService } from "@/services/moderationService";
import { DataSet, GetListBanWordsRequest, EditWordRequest, DeleteWordRequest, AddWordRequest } from "@/types/moderation.type";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BanWordTableProps {
    dataset: DataSet;
    onEdit: (wordId: number, newContent: string) => void;
    onDelete: (wordId: number) => void;
    openEditDialog: (wordId: number, word: string) => void;
}

const BanWordTable: React.FC<BanWordTableProps> = ({ dataset, onDelete, openEditDialog }) => {
    const _getLanguageText = (code: string): string => {
        switch (code) {
            case "EN":
                return "English";
            case "VN":
                return "Vietnamese";
            case "ZH":
                return "Simplified Chinese";
            default:
                return "English";
        }
    };

    return (
        <div className="border rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold p-4 bg-gray-100">
                Language: {_getLanguageText(dataset.LanguageCode)} ({dataset.Words.length})
            </h2>
            <div className="max-h-60 overflow-y-auto relative">
                <Table className="w-full">
                    <TableHeader className="bg-white sticky top-0 shadow-md z-10">
                        <TableRow>
                            <TableHead className="w-20">ID</TableHead>
                            <TableHead>Word</TableHead>
                            <TableHead className="w-32">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataset.Words.map((word) => (
                            <TableRow key={word.ID}>
                                <TableCell>{word.ID}</TableCell>
                                <TableCell>{word.Word}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditDialog(word.ID, word.Word)}>
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => onDelete(word.ID)}>
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default function DashboardModeration() {
    const [banWords, setBanWords] = useState<DataSet[]>([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editWordId, setEditWordId] = useState<number | null>(null);
    const [editWordContent, setEditWordContent] = useState("");
    const [newWordContent, setNewWordContent] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("EN");

    useEffect(() => {
        const fetchBanWords = async () => {
            const request: GetListBanWordsRequest = {
                RequestAccountID: 6,
            };
            const response = await ModerationService.getBanWord(request);
            setBanWords(response.Data);
        };
        fetchBanWords();
    }, []);

    const openEditDialog = (wordId: number, word: string) => {
        setEditWordId(wordId);
        setEditWordContent(word);
        setIsEditOpen(true);
    };

    const handleEdit = async () => {
        if (editWordId !== null) {
            const request: EditWordRequest = { ID: editWordId, Content: editWordContent };
            await ModerationService.editWord(request);
            setBanWords((prev) =>
                prev.map((dataset) => ({
                    ...dataset,
                    Words: dataset.Words.map((word) =>
                        word.ID === editWordId ? { ...word, Word: editWordContent } : word
                    ),
                }))
            );
            setIsEditOpen(false);
        }
    };

    const handleDelete = async (wordId: number) => {
        const request: DeleteWordRequest = { ID: wordId };
        await ModerationService.deleteWord(request);
        setBanWords((prev) =>
            prev.map((dataset) => ({
                ...dataset,
                Words: dataset.Words.filter((word) => word.ID !== wordId),
            }))
        );
    };

    const handleAddWord = async () => {
        if (!newWordContent.trim()) return;

        const request: AddWordRequest = {
            content: newWordContent,
            language_code: selectedLanguage,
            request_account_id: 6
        };
        const response = await ModerationService.addWord(request);

        if (response.Success) {
            setBanWords((prev) =>
                prev.map((dataset) =>
                    dataset.LanguageCode === selectedLanguage
                        ? { ...dataset, Words: [...dataset.Words, { ID: response.ID, Word: newWordContent }] }
                        : dataset
                )
            );
        }

        setNewWordContent("");
        setIsAddOpen(false);
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Global Ban Words</h1>

            <div className="flex justify-end">
                <Button onClick={() => setIsAddOpen(true)}>Add New Word</Button>
            </div>

            {banWords.map((dataset) => (
                <BanWordTable
                    key={dataset.LanguageCode}
                    dataset={dataset}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    openEditDialog={openEditDialog}
                />
            ))}

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Word</DialogTitle>
                    </DialogHeader>
                    <Input value={editWordContent} onChange={(e) => setEditWordContent(e.target.value)} />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEdit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add New Word Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Word</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Enter a word"
                        value={newWordContent}
                        onChange={(e) => setNewWordContent(e.target.value)}
                    />
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="EN">English</SelectItem>
                            <SelectItem value="VN">Vietnamese</SelectItem>
                            <SelectItem value="ZH">Simplified Chinese</SelectItem>
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddWord}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
