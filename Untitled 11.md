src/pages/mypage/physical-activity-level.vue
```
<route lang="yaml">
meta:
  title: 身体活動レベル変更
  requiresAuth: true
  requiresNoAuth: false
</route>

<template>
  <IonPage>
    <ContainersHeader
      title="身体活動レベル変更"
      default-href="/mypage"
    ></ContainersHeader>
    <IonContent>
      <NForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        :show-require-mark="false"
      >
        <AtomsFormSelectFormItem
          v-model:value="formValue.physicalActivityLevel"
          path="physicalActivityLevel"
          label="身体活動レベル"
          placeholder="身体活動レベル"
          :options="physicalActivityLevelOptions"
        />
        <div align="center" mt="24px">
          <IonButton size="large" color="btn-primary" @click="submit"
            >変更する</IonButton
          >
        </div>
      </NForm>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useIonRouter } from '@ionic/vue'
import type { FormInst, FormRules } from 'naive-ui'
import { SelectRequiredRule } from '~/logic/formRule'
import { PhysicalActivityLevelLabels } from '~/enums/physicalActivityLevel'
import { useApi } from '~/api'
import { useAuthStore } from '~/stores/auth'
import { UserDetail } from '~/models/userDetail'

interface PhysicalActivityLevelOption {
  label: string
  value: string
}

interface FormValue {
  physicalActivityLevel: string
}

const api = useApi()
const router = useIonRouter()
const authStore = useAuthStore()
const user = computed((): UserDetail => authStore.user || new UserDetail({}))
const formRef = ref<FormInst>()
const formValue = ref<FormValue>({
  physicalActivityLevel: user.value.physicalActivityLevel.toString(),
})

const physicalActivityLevelOptions: PhysicalActivityLevelOption[] =
  Object.entries(PhysicalActivityLevelLabels).map(([value, label]) => ({
    label,
    value,
  }))

const rules: FormRules = {
  physicalActivityLevel: [SelectRequiredRule('身体活動レベル')],
}

const submit = async () => {
  if (!formRef.value) {
    return
  }
  try {
    await formRef.value.validate()
    await api.v2.user.edit.post({
      body: {
        key: 'physicalActivityLevel',
        value: formValue.value.physicalActivityLevel,
      },
    })
    await router.back()
  } catch (error) {}
}
</script>

<style scoped lang="scss">
ion-content {
  --padding-start: 32px;
  --padding-end: 32px;
  --padding-top: 24px;
  --padding-bottom: 24px;
}
</style>
```
