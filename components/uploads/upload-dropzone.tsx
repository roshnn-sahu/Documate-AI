"use client";
import React from 'react'
import { FileUpload } from '../ui/file-upload'

const UploadDropzone = () => {
  return (
<>
<FileUpload onChange={(files) => console.log(files)} />
</>
  )
}

export default UploadDropzone