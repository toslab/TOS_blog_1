"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/dashboard_UI/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard_UI/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard_UI/select"
import { ArrowDown, ArrowUp, Users, Search, MousePointer, Clock, Globe, Zap } from "lucide-react"

// 방문자 데이터
const visitorData = [
  { date: "2023-05-01", visitors: 1200, newUsers: 420, pageViews: 3800 },
  { date: "2023-05-02", visitors: 1300, newUsers: 450, pageViews: 4100 },
  { date: "2023-05-03", visitors: 1400, newUsers: 470, pageViews: 4300 },
  { date: "2023-05-04", visitors: 1350, newUsers: 460, pageViews: 4200 },
  { date: "2023-05-05", visitors: 1500, newUsers: 500, pageViews: 4500 },
  { date: "2023-05-06", visitors: 1600, newUsers: 520, pageViews: 4700 },
  { date: "2023-05-07", visitors: 1700, newUsers: 550, pageViews: 5000 },
  { date: "2023-05-08", visitors: 1800, newUsers: 580, pageViews: 5200 },
  { date: "2023-05-09", visitors: 1750, newUsers: 570, pageViews: 5100 },
  { date: "2023-05-10", visitors: 1900, newUsers: 600, pageViews: 5400 },
  { date: "2023-05-11", visitors: 2000, newUsers: 650, pageViews: 5800 },
  { date: "2023-05-12", visitors: 2100, newUsers: 680, pageViews: 6000 },
  { date: "2023-05-13", visitors: 2200, newUsers: 700, pageViews: 6200 },
  { date: "2023-05-14", visitors: 2300, newUsers: 730, pageViews: 6500 },
]

// 검색 키워드 데이터
const keywordData = [
  { keyword: "디지털 마케팅", count: 320, percentage: 18 },
  { keyword: "콘텐츠 전략", count: 280, percentage: 16 },
  { keyword: "SEO 최적화", count: 250, percentage: 14 },
  { keyword: "소셜 미디어", count: 220, percentage: 12 },
  { keyword: "이메일 마케팅", count: 180, percentage: 10 },
  { keyword: "데이터 분석", count: 150, percentage: 8 },
  { keyword: "브랜드 전략", count: 120, percentage: 7 },
  { keyword: "마케팅 자동화", count: 100, percentage: 6 },
  { keyword: "기타", count: 160, percentage: 9 },
]

// 트래픽 소스 데이터
const trafficSourceData = [
  { name: "직접 방문", value: 35 },
  { name: "검색 엔진", value: 30 },
  { name: "소셜 미디어", value: 20 },
  { name: "이메일", value: 10 },
  { name: "광고", value: 5 },
]

// 방문 시간대 데이터
const timeOfDayData = [
  { time: "00-03", visitors: 120 },
  { time: "03-06", visitors: 80 },
  { time: "06-09", visitors: 200 },
  { time: "09-12", visitors: 500 },
  { time: "12-15", visitors: 600 },
  { time: "15-18", visitors: 700 },
  { time: "18-21", visitors: 800 },
  { time: "21-24", visitors: 400 },
]

// 디바이스 데이터
const deviceData = [
  { name: "데스크톱", value: 45 },
  { name: "모바일", value: 40 },
  { name: "태블릿", value: 15 },
]

// 국가별 방문자 데이터
const countryData = [
  { country: "대한민국", visitors: 1200, percentage: 60 },
  { country: "미국", visitors: 300, percentage: 15 },
  { country: "일본", visitors: 200, percentage: 10 },
  { country: "중국", visitors: 150, percentage: 7.5 },
  { country: "기타", visitors: 150, percentage: 7.5 },
]

// 페이지 성능 데이터
const performanceData = [
  { page: "홈페이지", loadTime: 1.2, bounceRate: 25 },
  { page: "블로그", loadTime: 1.5, bounceRate: 30 },
  { page: "제품 페이지", loadTime: 1.8, bounceRate: 20 },
  { page: "문의 양식", loadTime: 1.3, bounceRate: 15 },
  { page: "결제 페이지", loadTime: 2.0, bounceRate: 10 },
]

// 파이 차트 색상
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// 날짜 포맷 함수
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 숫자 포맷 함수
const formatNumber = (num: number) => {
  return new Intl.NumberFormat("ko-KR").format(num)
}

// 퍼센트 변화 계산 함수
const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return 100
  return ((current - previous) / previous) * 100
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState("2주")

  // 최근 데이터와 이전 기간 비교를 위한 계산
  const currentVisitors = visitorData.slice(-7).reduce((sum, item) => sum + item.visitors, 0)
  const previousVisitors = visitorData.slice(-14, -7).reduce((sum, item) => sum + item.visitors, 0)
  const visitorChange = calculateChange(currentVisitors, previousVisitors)

  const currentPageViews = visitorData.slice(-7).reduce((sum, item) => sum + item.pageViews, 0)
  const previousPageViews = visitorData.slice(-14, -7).reduce((sum, item) => sum + item.pageViews, 0)
  const pageViewChange = calculateChange(currentPageViews, previousPageViews)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">웹사이트 분석 보고서</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="기간 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1주">최근 1주</SelectItem>
            <SelectItem value="2주">최근 2주</SelectItem>
            <SelectItem value="1개월">최근 1개월</SelectItem>
            <SelectItem value="3개월">최근 3개월</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 주요 지표 요약 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">총 방문자</p>
                <p className="text-2xl font-bold">{formatNumber(currentVisitors)}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {visitorChange > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={visitorChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(visitorChange).toFixed(1)}%
              </span>
              <span className="ml-1 text-gray-500">지난 기간 대비</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">페이지뷰</p>
                <p className="text-2xl font-bold">{formatNumber(currentPageViews)}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <MousePointer className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {pageViewChange > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={pageViewChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(pageViewChange).toFixed(1)}%
              </span>
              <span className="ml-1 text-gray-500">지난 기간 대비</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">평균 체류 시간</p>
                <p className="text-2xl font-bold">3분 45초</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">12.5%</span>
              <span className="ml-1 text-gray-500">지난 기간 대비</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">이탈률</p>
                <p className="text-2xl font-bold">32.4%</p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">3.2%</span>
              <span className="ml-1 text-gray-500">지난 기간 대비</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 방문자 트렌드 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle>방문자 트렌드</CardTitle>
          <CardDescription>일별 방문자 수와 페이지뷰 추이</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={visitorData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [formatNumber(value), ""]}
                  labelFormatter={(label) => formatDate(label)}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="방문자 수"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  name="페이지뷰"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 검색 키워드 및 트래픽 소스 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 검색 키워드 */}
        <Card>
          <CardHeader>
            <CardTitle>인기 검색 키워드</CardTitle>
            <CardDescription>방문자들이 사용한 주요 검색어</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keywordData.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Search className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{item.keyword}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{item.count}회</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-500">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={keywordData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [`${value}회`, "검색 횟수"]} />
                  <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 트래픽 소스 */}
        <Card>
          <CardHeader>
            <CardTitle>트래픽 소스</CardTitle>
            <CardDescription>방문자 유입 경로 분석</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {trafficSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "비율"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 분석 탭 */}
      <Card>
        <CardHeader>
          <CardTitle>상세 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="time">
            <TabsList className="mb-4">
              <TabsTrigger value="time">시간대별 방문</TabsTrigger>
              <TabsTrigger value="device">디바이스</TabsTrigger>
              <TabsTrigger value="geo">지역</TabsTrigger>
              <TabsTrigger value="performance">페이지 성능</TabsTrigger>
            </TabsList>

            <TabsContent value="time">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeOfDayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${formatNumber(value)}명`, "방문자 수"]} />
                    <Bar dataKey="visitors" name="방문자 수" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  방문자는 주로 오후 시간대(15-21시)에 집중되어 있으며, 특히 18-21시 사이에 가장 많은 트래픽이
                  발생합니다. 이 시간대에 새로운 콘텐츠를 게시하거나 마케팅 활동을 진행하는 것이 효과적일 수 있습니다.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="device">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, "비율"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-4">디바이스 사용 분석</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-2 rounded-full bg-blue-100 p-1">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="font-medium">데스크톱 (45%)</p>
                        <p className="text-sm text-gray-500">주로 업무 시간 중 사용, 평균 체류 시간 4분 30초</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 rounded-full bg-green-100 p-1">
                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      </div>
                      <div>
                        <p className="font-medium">모바일 (40%)</p>
                        <p className="text-sm text-gray-500">주로 저녁 시간대 사용, 평균 체류 시간 2분 45초</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 rounded-full bg-yellow-100 p-1">
                        <div className="h-2 w-2 rounded-full bg-yellow-600"></div>
                      </div>
                      <div>
                        <p className="font-medium">태블릿 (15%)</p>
                        <p className="text-sm text-gray-500">주로 주말에 사용, 평균 체류 시간 3분 15초</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="geo">
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          국가
                        </th>
                        <th scope="col" className="px-6 py-3">
                          방문자 수
                        </th>
                        <th scope="col" className="px-6 py-3">
                          비율
                        </th>
                        <th scope="col" className="px-6 py-3">
                          평균 체류 시간
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {countryData.map((item, index) => (
                        <tr key={index} className="bg-white border-b">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center">
                              <Globe className="mr-2 h-4 w-4 text-gray-400" />
                              {item.country}
                            </div>
                          </td>
                          <td className="px-6 py-4">{formatNumber(item.visitors)}</td>
                          <td className="px-6 py-4">{item.percentage}%</td>
                          <td className="px-6 py-4">
                            {index === 0
                              ? "3분 50초"
                              : index === 1
                                ? "3분 20초"
                                : index === 2
                                  ? "2분 45초"
                                  : index === 3
                                    ? "2분 30초"
                                    : "2분 10초"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`${formatNumber(value)}명`, "방문자 수"]} />
                      <Bar dataKey="visitors" name="방문자 수" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          페이지
                        </th>
                        <th scope="col" className="px-6 py-3">
                          로딩 시간
                        </th>
                        <th scope="col" className="px-6 py-3">
                          이탈률
                        </th>
                        <th scope="col" className="px-6 py-3">
                          성능 점수
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((item, index) => (
                        <tr key={index} className="bg-white border-b">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.page}</td>
                          <td className="px-6 py-4">{item.loadTime}초</td>
                          <td className="px-6 py-4">{item.bounceRate}%</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    item.loadTime < 1.5
                                      ? "bg-green-600"
                                      : item.loadTime < 1.8
                                        ? "bg-yellow-400"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${Math.max(0, 100 - item.loadTime * 30)}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm">
                                {Math.max(0, 100 - Math.round(item.loadTime * 30))}/100
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">성능 개선 제안</h4>
                  <p className="text-sm text-yellow-700">
                    제품 페이지와 결제 페이지의 로딩 시간이 다른 페이지보다 길게 나타납니다. 이미지 최적화와 불필요한
                    스크립트 제거를 통해 페이지 로딩 속도를 개선할 수 있습니다.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 요약 및 제안 */}
      <Card>
        <CardHeader>
          <CardTitle>분석 요약 및 제안</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-md font-medium text-blue-800 mb-2">주요 발견 사항</h3>
              <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                <li>방문자 수가 지난 기간 대비 {visitorChange.toFixed(1)}% 증가했습니다.</li>
                <li>가장 많은 방문이 발생하는 시간대는 18-21시입니다.</li>
                <li>
                  "디지털 마케팅"과 "콘텐츠 전략"이 가장 많이 검색된 키워드로, 이 주제에 대한 콘텐츠 강화가 필요합니다.
                </li>
                <li>모바일 사용자의 비율이 전월 대비 5% 증가했습니다.</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-md font-medium text-green-800 mb-2">개선 제안</h3>
              <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
                <li>
                  모바일 사용자 경험 최적화: 모바일 사용자가 증가하고 있으므로, 모바일 인터페이스 개선이 필요합니다.
                </li>
                <li>
                  콘텐츠 전략 강화: "디지털 마케팅"과 "콘텐츠 전략" 관련 콘텐츠를 더 많이 제작하여 검색 트래픽을
                  늘리세요.
                </li>
                <li>
                  페이지 성능 개선: 제품 페이지와 결제 페이지의 로딩 시간을 개선하여 이탈률을 낮추는 것이 좋습니다.
                </li>
                <li>
                  저녁 시간대 마케팅 강화: 18-21시에 방문자가 가장 많으므로, 이 시간대에 소셜 미디어 포스팅이나 이메일
                  마케팅을 집중하세요.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
