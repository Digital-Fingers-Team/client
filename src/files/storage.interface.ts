export interface StorageService {
    saveFile(file: any, subPath: string): Promise<string>;
    deleteFile(filePath: string): Promise<void>;
    getFileStream(filePath: string): Promise<NodeJS.ReadableStream>;
}
