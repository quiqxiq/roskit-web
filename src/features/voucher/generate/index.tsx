import { useState } from 'react'
import { toast } from 'sonner'
import { Main } from '@/components/layout/main'
import { VoucherGenerateFormPanel } from './components/voucher-generate-form'
import { VoucherResultTable } from './components/voucher-result-table'
import { defaultGenerateForm, generateBatch } from './data/data'
import {
  type GeneratedVoucher,
  type VoucherGenerateForm,
} from './data/schema'

export function VoucherGenerate() {
  const [form, setForm] = useState<VoucherGenerateForm>(defaultGenerateForm)
  const [vouchers, setVouchers] = useState<GeneratedVoucher[]>([])
  const [resultProfile, setResultProfile] = useState<string>('')
  const [resultServer, setResultServer] = useState<string>('')

  const handleGenerate = () => {
    if (!form.profile) {
      toast.error('Profile is required')
      return
    }
    const batch = generateBatch(form)
    setVouchers(batch)
    setResultProfile(form.profile)
    setResultServer(form.server)
    toast.success(`Generated ${batch.length} voucher${batch.length > 1 ? 's' : ''}`, {
      description: `Profile: ${form.profile}`,
    })
  }

  const handleReset = () => {
    setForm(defaultGenerateForm)
    setVouchers([])
    setResultProfile('')
    setResultServer('')
  }

  return (
    <Main className='flex flex-1 flex-col gap-3 sm:gap-6'>
      <div>
        <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
          Generate Vouchers
        </h2>
        <p className='text-sm text-muted-foreground sm:text-base'>
          Create batches of hotspot voucher users
        </p>
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]'>
        <VoucherGenerateFormPanel
          form={form}
          onChange={setForm}
          onGenerate={handleGenerate}
          onReset={handleReset}
        />
        <VoucherResultTable
          vouchers={vouchers}
          profile={resultProfile}
          server={resultServer}
        />
      </div>
    </Main>
  )
}
