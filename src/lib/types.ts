// 공통 데이터 인터페이스 정의
// any 타입 대신 이 타입들을 사용하여 코드의 가독성과 안정성을 높입니다.

export interface NavFile {
    id?: string;
    name: string;
    url: string;
    storagePath?: string;
    size?: number;
    createdAt?: Date | any; // Firestore Timestamp 처리를 위해 any 허용 혹은 변환 로직 필요
}

export interface Project {
    id?: string;
    title: string;
    image: string;
    summary: string;
    description: string;
    link: string;
    createdAt?: Date | any;
}

export interface Publication {
    id?: string;
    title: string;
    conference: string;
    description: string;
    createdAt?: Date | any;
}