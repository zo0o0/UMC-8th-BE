import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaginationService {
  constructor(private readonly prisma: PrismaService) {}

  async paginate(
    model: keyof PrismaService, // ✅ Prisma 모델을 안전하게 받음
    cursorField: string, // ✅ 커서 필드 (id 등)
    paginationDto: {
      cursor?: string | number;
      limit?: number;
      search?: string; // ✅ 검색 기능 추가
      extraWhere?: Record<string, any>; // ✅ 추가 필터 조건 (특정 userId 등)
    },
  ): Promise<{
    data: any[];
    nextCursor: string | number | null;
    hasNext: boolean;
  }> {
    const { cursor, limit = 10, search, extraWhere = {} } = paginationDto;

    // ✅ 커서 필터 추가
    const cursorCondition = cursor ? { [cursorField]: { gt: cursor } } : {};

    // ✅ model이 PrismaService의 key인지 확인
    if (!(model in this.prisma)) {
      throw new Error(`Invalid model: ${String(model)}`);
    }

    // ✅ Prisma 동적 모델 사용 시 안전한 타입 처리
    const prismaModel = this.prisma[model] as any;

    // ✅ 검색 가능한 필드 정의 (모델별 필드를 동적으로 지정)
    const searchableFields: Record<string, string[]> = {
      lp: ['title'],
    };

    // ✅ 해당 모델이 검색 가능한 필드를 가지고 있는지 확인
    const searchFields = searchableFields[String(model)] || [];

    // ✅ 검색 조건 추가 (모델별 필드에서 검색 가능하도록 수정)
    const searchCondition =
      searchFields.length && search
        ? {
            OR: searchFields.map((field) => ({
              [field]: { contains: search },
            })),
          }
        : {};

    // ✅ `cursorCondition`과 `searchCondition`만 병합
    const finalWhere = {
      ...searchCondition, // 검색 조건 추가
      ...cursorCondition, // 커서 페이징 조건 추가
      ...extraWhere,
    };

    try {
      const results = await prismaModel.findMany({
        where: finalWhere, // ✅ 동적으로 where 조건 추가
        take: limit + 1, // ✅ hasNext 확인을 위해 limit+1 개 조회
        orderBy: { [cursorField]: 'asc' },
      });

      const hasNext = results.length > limit;
      if (hasNext) {
        results.pop();
      }

      return {
        data: results,
        nextCursor: results.length
          ? results[results.length - 1][cursorField]
          : null,
        hasNext,
      };
    } catch (error) {
      console.error('Prisma findMany error:', error);
      throw new Error('Database query failed');
    }
  }
}
