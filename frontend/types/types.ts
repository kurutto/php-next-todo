export interface UserType {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    fridgeId?: string | null;
    fridgeName?: string | null;
    deleteConfirm: boolean;
}

export interface TodoType {
    id: number;
    timestamps: Date;
    title: string;
    completed: boolean;
}