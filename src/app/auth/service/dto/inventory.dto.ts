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

export class RetrieveSellChannelDto {

    user_id: number;
    channel_id: number;
    product_ids: number[];
    note: string;
    attached_file_name: string;
    attached_file_content: string;
    
}

export class RetrieveAllSellChannelDto {

    user_id: number;
    channel_id: number;
    note: string;
    attached_file_name: string;
    attached_file_content: string;

}

export class CreateBatchRetrieveDto {
    title: string;
    quantility: number;
    channel_id: number;
}

export class UpdateBatchDto {
    products: any;
    batch_id: number;
    channel_id: number;
}