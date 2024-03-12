export class CreateBatchExportDto {
    title: string;
    quantity: number;
    channel_id: number;
    to_channel_id: number;
    user_id: number;
}

export class UpdateBatchExportDto {
    products: any;
    batch_id: number;
    user_id: number;
    action: string;
}

export class ApproveBatch {
    batch_id: number;
    user_id: number;
}