import { Controller, useFormContext } from 'react-hook-form'

import { FormHelperText } from '@mui/material'
// type
import { UploadAvatar, UploadMultiFile, UploadMultiFileProps, UploadProps, UploadSingleFile } from '../upload'

interface Props extends Omit<UploadProps, 'file'> {
    name: string
}

export function RHFUploadAvatar({ name, ...other }: Props) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const checkError = !!error && !field.value

                return (
                    <div>
                        <UploadAvatar error={checkError} {...other} file={field.value} />
                        {checkError && (
                            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                                {error.message}
                            </FormHelperText>
                        )}
                    </div>
                )
            }}
        />
    )
}

export function RHFUploadSingleFile({ name, ...other }: Props) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const checkError = !!error && !field.value

                return (
                    <UploadSingleFile
                        accept={{ image: ['image/*'] }}
                        file={field.value}
                        error={checkError}
                        helperText={
                            checkError && (
                                <FormHelperText error sx={{ px: 2 }}>
                                    {error.message}
                                </FormHelperText>
                            )
                        }
                        {...other}
                    />
                )
            }}
        />
    )
}

interface RHFUploadMultiFileProps extends Omit<UploadMultiFileProps, 'files'> {
    name: string
}

export function RHFUploadMultiFile({ name, ...other }: RHFUploadMultiFileProps) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const checkError = !!error && field.value?.length === 0

                return (
                    <UploadMultiFile
                        accept={{ image: ['image/*'] }}
                        files={field.value}
                        error={checkError}
                        helperText={
                            checkError && (
                                <FormHelperText error sx={{ px: 2 }}>
                                    {error?.message}
                                </FormHelperText>
                            )
                        }
                        {...other}
                    />
                )
            }}
        />
    )
}
