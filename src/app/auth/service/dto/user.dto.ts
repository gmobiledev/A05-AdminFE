export class SearchUserDto {
    keyword: string;
    status: number; 
    date_range: string;
    service_code: string;
    page: number;
    page_size: number;
    is_agent: number;
}

export class CreateUserDto {
    username: string;
    mobile: string;
    password: string;
    user_create: number;
    service_code: string;
    ref_code: string;
    create_agent: boolean;
}

export class CreateAgentDto {
    username: string;
    mobile: string;
    password: string;
    agent_service: CreateAgentServiceDto[];
}

export class CreateAgentServiceDto {
    ref_code: string;
    service_code: string;
}

export class UpdateStatusAgentDto {
    id: number;
    status: number;
}