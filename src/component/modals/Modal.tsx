import type React from "react"
import type { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
    title: string
    modalRef: React.RefObject<HTMLDialogElement | null>
}>

export const Modal = ({ title, modalRef, children }: Props) => {

    return (
        <dialog ref={modalRef} className="m-auto border-2">
            <h1 className="border-b-2 text-center">{title}</h1>
            {children}
        </dialog>
    )
}