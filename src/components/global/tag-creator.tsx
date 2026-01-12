"use client";

import { Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import TagComponent from "./tag";
import { PlusCircleIcon, TrashIcon, X } from "lucide-react";
import { useToast } from "../ui/use-toast"; // ✅ FIX
import { v4 } from "uuid";
import {
  deleteTag,
  getTagsForSubaccount,
  saveActivityLogsNotification,
  upsertTag,
} from "@/lib/queries";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type Props = {
  subAccountId: string;
  getSelectedTags: (tags: Tag[]) => void;
  defaultTags?: Tag[];
};

const TagColors = ["BLUE", "ORANGE", "ROSE", "PURPLE", "GREEN"] as const;
export type TagColor = (typeof TagColors)[number];

const TagCreator = ({ getSelectedTags, subAccountId, defaultTags }: Props) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || []);
  const [tags, setTags] = useState<Tag[]>([]);
  const [value, setValue] = useState("");
  const [selectedColor, setSelectedColor] = useState<TagColor | "">("");

  const router = useRouter();
  const { toast } = useToast(); // ✅ FIX

  useEffect(() => {
    getSelectedTags(selectedTags);
  }, [selectedTags, getSelectedTags]);

  useEffect(() => {
    if (!subAccountId) return;

    const fetchData = async () => {
      const response = await getTagsForSubaccount(subAccountId);
      if (response) setTags(response.Tags);
    };

    fetchData();
  }, [subAccountId]);

  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const handleAddTag = async () => {
    if (!value) {
      toast({
        variant: "destructive",
        title: "Tags need to have a name",
      });
      return;
    }

    if (!selectedColor) {
      toast({
        variant: "destructive",
        title: "Please select a color",
      });
      return;
    }

    const tagData: Tag = {
      id: v4(),
      name: value,
      color: selectedColor,
      subAccountId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTags((prev) => [...prev, tagData]);
    setValue("");
    setSelectedColor("");

    try {
      const response = await upsertTag(subAccountId, tagData);

      toast({
        title: "Tag created",
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Created tag | ${response?.name}`,
        subAccountId,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Could not create tag",
      });
    }
  };

  const handleAddSelections = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id) ? prev : [...prev, tag]
    );
  };

  const handleDeleteTag = async (tagId: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== tagId));

    try {
      const response = await deleteTag(tagId);

      toast({
        title: "Deleted tag",
        description: "The tag was deleted successfully.",
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted tag | ${response?.name}`,
        subAccountId,
      });

      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Could not delete tag",
      });
    }
  };

  return (
    <AlertDialog>
      <Command className="bg-transparent">
        {!!selectedTags.length && (
          <div className="flex flex-wrap gap-2 p-2 bg-background border-2 rounded-md">
            {selectedTags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-1">
                <TagComponent title={tag.name} colorName={tag.color} />
                <X
                  size={14}
                  className="cursor-pointer text-muted-foreground"
                  onClick={() => handleDeleteSelection(tag.id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 my-2">
          {TagColors.map((color) => (
            <TagComponent
              key={color}
              title=""
              colorName={color}
              selectedColor={setSelectedColor}
            />
          ))}
        </div>

        <div className="relative">
          <CommandInput
            placeholder="Search for tag..."
            value={value}
            onValueChange={setValue}
          />
          <PlusCircleIcon
            onClick={handleAddTag}
            size={20}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary"
          />
        </div>

        <CommandList>
          <CommandSeparator />
          <CommandGroup heading="Tags">
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                className="flex justify-between cursor-pointer"
              >
                <div onClick={() => handleAddSelections(tag)}>
                  <TagComponent title={tag.name} colorName={tag.color} />
                </div>

                <AlertDialogTrigger>
                  <TrashIcon
                    size={16}
                    className="text-muted-foreground hover:text-rose-400"
                  />
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      Delete Tag
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    </AlertDialog>
  );
};

export default TagCreator;
