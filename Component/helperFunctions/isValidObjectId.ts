export function isValidObjectId(id: string) {
    return /^[a-fA-F0-9]{24}$/.test(id);
}
