"use server"

import { cookies } from "next/headers"

// 실제 구현에서는 데이터베이스에 저장해야 합니다.
// 이 예제에서는 메모리에 저장합니다 (서버 재시작 시 초기화됨)
let totalVisitors = 1024 // 초기값 설정
let todayVisitors = new Map<string, Set<string>>() // 날짜별 방문자 ID 저장

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
function getTodayString() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

// 방문자 수 증가 및 조회
export async function trackVisitor() {
  const cookieStore = cookies()
  const visitorId = cookieStore.get("visitor_id")?.value
  const today = getTodayString()

  // 오늘 날짜에 해당하는 Set이 없으면 생성
  if (!todayVisitors.has(today)) {
    todayVisitors = new Map() // 새로운 날짜가 되면 이전 데이터 초기화
    todayVisitors.set(today, new Set())
  }

  const todayVisitorSet = todayVisitors.get(today)!

  // 새 방문자인 경우
  if (!visitorId) {
    const newVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    cookieStore.set("visitor_id", newVisitorId, {
      maxAge: 60 * 60 * 24 * 365, // 1년
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    })

    // 총 방문자 수 증가
    totalVisitors++

    // 오늘 방문자 수에 추가
    todayVisitorSet.add(newVisitorId)
  } else if (!todayVisitorSet.has(visitorId)) {
    // 기존 방문자지만 오늘 처음 방문한 경우
    todayVisitorSet.add(visitorId)
  }

  return {
    totalVisitors,
    todayVisitors: todayVisitorSet.size,
  }
}

