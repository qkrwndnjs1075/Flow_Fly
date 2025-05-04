export class DataCache<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map()
  private readonly ttl: number // 캐시 유효 시간 (밀리초)

  constructor(ttlInSeconds = 300) {
    // 기본 5분
    this.ttl = ttlInSeconds * 1000
  }

  // 캐시에 데이터 저장
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  // 캐시에서 데이터 조회
  get(key: string): T | null {
    const cached = this.cache.get(key)

    if (!cached) {
      return null
    }

    // 캐시 만료 확인
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  // 캐시 삭제
  delete(key: string): void {
    this.cache.delete(key)
  }

  // 캐시 전체 삭제
  clear(): void {
    this.cache.clear()
  }

  // 특정 패턴의 키를 가진 캐시 삭제
  clearPattern(pattern: string): void {
    const regex = new RegExp(pattern)

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

// 데이터 동기화 상태 관리
export class SyncStatus {
  private status: Map<string, { synced: boolean; lastSync: number; error?: string }> = new Map()

  // 동기화 상태 설정
  setSynced(key: string, synced: boolean, error?: string): void {
    this.status.set(key, {
      synced,
      lastSync: Date.now(),
      error,
    })
  }

  // 동기화 상태 확인
  isSynced(key: string): boolean {
    return this.status.get(key)?.synced || false
  }

  // 마지막 동기화 시간 확인
  getLastSyncTime(key: string): number | null {
    return this.status.get(key)?.lastSync || null
  }

  // 동기화 오류 확인
  getError(key: string): string | undefined {
    return this.status.get(key)?.error
  }

  // 모든 동기화 상태 조회
  getAllStatus(): Record<string, { synced: boolean; lastSync: number; error?: string }> {
    const result: Record<string, { synced: boolean; lastSync: number; error?: string }> = {}

    for (const [key, value] of this.status.entries()) {
      result[key] = value
    }

    return result
  }
}
