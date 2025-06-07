'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard_UI/card';
import { Button } from '@/components/dashboard_UI/button';
import { Badge } from '@/components/dashboard_UI/badge';
import { Label } from '@/components/dashboard_UI/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/dashboard_UI/select';
import { Printer, FileText, Download, Settings, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LabelPrinterProps {
  selectedOrders: string[];
  onPrintComplete: () => void;
}

export default function LabelPrinter({ selectedOrders, onPrintComplete }: LabelPrinterProps) {
  const [printerSettings, setPrinterSettings] = useState({
    format: 'thermal', // thermal, a4
    copies: 1,
    startPosition: 1,
  });

  const handlePrint = () => {
    console.log('Printing labels for orders:', selectedOrders);
    console.log('Settings:', printerSettings);
    
    // 실제 구현에서는 PDF 생성 또는 프린터 연동
    window.print();
    
    // 출력 완료 처리
    setTimeout(() => {
      onPrintComplete();
    }, 1000);
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF for orders:', selectedOrders);
    // PDF 생성 및 다운로드 로직
  };

  return (
    <div className="space-y-6">
      {/* Selected Orders Summary */}
      {selectedOrders.length > 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-medium">출력 준비 완료</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedOrders.length}개의 송장이 선택되었습니다
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {selectedOrders.length}개
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">
              배송 대기열에서 출력할 주문을 선택해주세요
            </p>
          </CardContent>
        </Card>
      )}

      {/* Printer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            프린터 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>출력 형식</Label>
            <Select
              value={printerSettings.format}
              onValueChange={(value) => setPrinterSettings({
                ...printerSettings,
                format: value
              })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thermal">감열 프린터 (100x150mm)</SelectItem>
                <SelectItem value="a4">A4 용지 (4분할)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>출력 매수</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={printerSettings.copies}
                onChange={(e) => setPrinterSettings({
                  ...printerSettings,
                  copies: parseInt(e.target.value) || 1
                })}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>시작 위치 (A4 용지)</Label>
              <Select
                value={printerSettings.startPosition.toString()}
                onValueChange={(value) => setPrinterSettings({
                  ...printerSettings,
                  startPosition: parseInt(value)
                })}
                disabled={printerSettings.format !== 'a4'}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1번 (좌상단)</SelectItem>
                  <SelectItem value="2">2번 (우상단)</SelectItem>
                  <SelectItem value="3">3번 (좌하단)</SelectItem>
                  <SelectItem value="4">4번 (우하단)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Preview */}
      <Card>
        <CardHeader>
          <CardTitle>미리보기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "border rounded-lg p-4",
            printerSettings.format === 'thermal' ? "max-w-sm mx-auto" : "grid grid-cols-2 gap-4"
          )}>
            {/* 송장 미리보기 예시 */}
            <div className="border p-4 text-xs space-y-2">
              <div className="text-center font-bold">우체국택배</div>
              <div className="border-t pt-2">
                <p><strong>받는분:</strong> 김철수</p>
                <p><strong>주소:</strong> 서울시 강남구 테헤란로 123</p>
                <p><strong>연락처:</strong> 010-1234-5678</p>
              </div>
              <div className="border-t pt-2">
                <p><strong>보내는분:</strong> (주)우리회사</p>
                <p><strong>주문번호:</strong> ORD-2024-0001</p>
              </div>
              <div className="text-center pt-4">
                <div className="inline-block border-2 border-black p-2">
                  [바코드]
                </div>
                <p className="mt-1 font-mono">1234567890</p>
              </div>
            </div>
            
            {printerSettings.format === 'a4' && (
              <>
                <div className="border p-4 text-xs opacity-50">
                  {/* 추가 송장 미리보기 */}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button 
          variant="outline"
          onClick={handleDownloadPDF}
          disabled={selectedOrders.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          PDF 다운로드
        </Button>
        <Button 
          onClick={handlePrint}
          disabled={selectedOrders.length === 0}
        >
          <Printer className="w-4 h-4 mr-2" />
          송장 출력
        </Button>
      </div>
    </div>
  );
}