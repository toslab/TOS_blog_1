"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/Button"
import { Input } from "@/components/dashboard_UI/input"
import { Label } from "@/components/dashboard_UI/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard_UI/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/dashboard_UI/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/dashboard_UI/avatar"
import { User, Lock, Mail, Phone, Building, MapPin, X } from "lucide-react"

// 컴포넌트 props 타입에 onClose 추가
export default function Settings({ onClose }: { onClose?: () => void }) {
  const [profileImage, setProfileImage] = useState<string | null>(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  )
  const [isUploading, setIsUploading] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [profileForm, setProfileForm] = useState({
    name: "Tom Cook",
    email: "tom.cook@example.com",
    phone: "+82 10-1234-5678",
    company: "Acme Inc.",
    location: "서울, 대한민국",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
    setPasswordError(null)
    setPasswordSuccess(null)
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
    setProfileSuccess(null)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 간단한 유효성 검사
    if (!passwordForm.currentPassword) {
      setPasswordError("현재 비밀번호를 입력해주세요.")
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("새 비밀번호는 8자 이상이어야 합니다.")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.")
      return
    }

    // 비밀번호 변경 성공 (실제로는 API 호출)
    setPasswordSuccess("비밀번호가 성공적으로 변경되었습니다.")
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 프로필 업데이트 성공 (실제로는 API 호출)
    setProfileSuccess("프로필이 성공적으로 업데이트되었습니다.")
  }

  // 제목 부분을 다음과 같이 수정하여 X 버튼 추가
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">설정</h1>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="닫기">
            <X className="size-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 프로필 사진 섹션 */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>프로필 사진</CardTitle>
            <CardDescription>프로필 이미지를 변경합니다.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-4 cursor-pointer" onClick={handleProfileImageClick}>
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileImage || ""} alt="프로필 이미지" />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full text-white">
                사진 변경
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button variant="outline" size="sm" onClick={handleProfileImageClick}>
              이미지 업로드
            </Button>
          </CardContent>
        </Card>

        {/* 프로필 정보 및 비밀번호 탭 */}
        <div className="md:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">프로필 정보</TabsTrigger>
              <TabsTrigger value="password">비밀번호 변경</TabsTrigger>
            </TabsList>

            {/* 프로필 정보 탭 */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>프로필 정보</CardTitle>
                  <CardDescription>개인 정보를 관리합니다.</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">이름</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">전화번호</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">회사</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="company"
                            name="company"
                            value={profileForm.company}
                            onChange={handleProfileChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="location">위치</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="location"
                            name="location"
                            value={profileForm.location}
                            onChange={handleProfileChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    {profileSuccess && (
                      <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{profileSuccess}</div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">저장하기</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* 비밀번호 변경 탭 */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>비밀번호 변경</CardTitle>
                  <CardDescription>계정 보안을 위해 주기적으로 비밀번호를 변경하세요.</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">현재 비밀번호</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">새 비밀번호</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500">비밀번호는 최소 8자 이상이어야 합니다.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    {passwordError && (
                      <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{passwordError}</div>
                    )}
                    {passwordSuccess && (
                      <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{passwordSuccess}</div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">비밀번호 변경</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
