"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Modal, ModalTrigger, ModalContent, ModalTitle, ModalDescription, ModalFooter, ModalClose } from "../../components/ui/modal";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogCancel, DialogAction } from "../../components/ui/dialog";

export function NestedModalExamples() {
  return (
    <Modal>
      <ModalTrigger render={<Button variant="secondary" />}>嵌套弹窗</ModalTrigger>
      <ModalContent data-demo="nested-modal-parent" className="max-w-xl">
        <ModalTitle>项目设置</ModalTitle>
        <ModalDescription>打开下一层时，当前弹窗会缩小并向上缩进；返回时恢复。</ModalDescription>
        <label className="mt-5 block space-y-2"><span>项目名称</span><Input defaultValue="示例项目" /></label>
        <p className="mt-4 text-secondary">输入内容会保留，不会因为打开下一层而重置。</p>
        <ModalFooter className="mt-6">
          <ModalClose render={<Button variant="secondary" />}>关闭设置</ModalClose>
          <Modal>
            <ModalTrigger render={<Button />}>打开高级设置</ModalTrigger>
            <ModalContent data-demo="nested-modal-child">
              <ModalTitle>高级设置</ModalTitle>
              <ModalDescription>可以继续打开确认弹窗，观察多层缩进效果。</ModalDescription>
              <ModalFooter className="mt-6">
                <ModalClose render={<Button variant="secondary" />}>返回项目设置</ModalClose>
                <Dialog>
                  <DialogTrigger render={<Button variant="danger" />}>重置设置</DialogTrigger>
                  <DialogContent data-demo="nested-modal-confirm" className="max-w-sm">
                    <DialogTitle>重置高级设置？</DialogTitle>
                    <DialogDescription>这里只演示确认流程。关闭后，上一层弹窗会恢复。</DialogDescription>
                    <DialogFooter className="mt-6">
                      <DialogCancel render={<Button variant="secondary" />}>取消重置</DialogCancel>
                      <DialogAction render={<Button variant="danger" />}>确认重置</DialogAction>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
