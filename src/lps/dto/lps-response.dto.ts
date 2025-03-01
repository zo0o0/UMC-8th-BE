import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from '../../common/dto/common-response.dto';

// 공통 LP 정보 DTO (리스트와 상세 조회 모두 사용)
export class LpResponseDto {
  @ApiProperty({ example: 1, description: 'LP의 고유 식별자' })
  id: number;

  @ApiProperty({
    example: 'Sunday Morning.',
    description: 'LP 제목',
  })
  title: string;

  @ApiProperty({
    example: 'Rain is Falling',
    description: 'LP 내용',
  })
  content: string;

  @ApiProperty({
    example: 'https://loremflickr.com/1837/1249?lock=3373621954278616',
    description: 'LP 썸네일 URL',
  })
  thumbnail: string;

  @ApiProperty({ example: true, description: '발행 여부' })
  published: boolean;

  @ApiProperty({ example: 4, description: '작성자 ID' })
  authorId: number;

  @ApiProperty({
    example: '2025-02-22T13:49:29.037Z',
    description: '생성 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-02-22T13:49:29.037Z',
    description: '수정 일자',
  })
  updatedAt: Date;
}

// 리스트 응답용 DTO
export class LpListDataResponseDto {
  @ApiProperty({
    type: [LpResponseDto],
    description: 'LP 목록',
  })
  data: LpResponseDto[];

  @ApiProperty({ example: 10, description: '다음 커서 (nextCursor)' })
  nextCursor: number;

  @ApiProperty({ example: true, description: '추가 페이지 여부 (hasNext)' })
  hasNext: boolean;
}

export class LpListResponseDto extends CommonResponse<LpListDataResponseDto> {
  @ApiProperty({ type: LpListDataResponseDto, nullable: true })
  data: LpListDataResponseDto;
}

// 상세 응답용 DTO에 포함될 작성자 정보
export class AuthorResponseDto {
  @ApiProperty({ example: 4, description: '작성자 고유 식별자' })
  id: number;

  @ApiProperty({ example: '매튜', description: '작성자 이름' })
  name: string;

  @ApiProperty({
    example: 'dydals34404@gmail.com',
    description: '작성자 이메일',
  })
  email: string;

  @ApiProperty({ example: null, nullable: true, description: '작성자 소개' })
  bio: string | null;

  @ApiProperty({ example: null, nullable: true, description: '작성자 아바타' })
  avatar: string | null;

  @ApiProperty({
    example: '2025-02-22T13:38:53.339Z',
    description: '생성 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-02-22T13:38:53.339Z',
    description: '수정 일자',
  })
  updatedAt: Date;
}

export class LpDetailResponseDto extends LpResponseDto {
  @ApiProperty({ type: AuthorResponseDto, description: '작성자 정보' })
  author: AuthorResponseDto;

  @ApiProperty({
    example: [],
    description: '태그 목록',
    isArray: true,
    type: String,
  })
  tags: string[];
}

export class LpDetailResponseWrapperDto extends CommonResponse<LpDetailResponseDto> {
  @ApiProperty({ type: LpDetailResponseDto, nullable: true })
  data: LpDetailResponseDto;
}
