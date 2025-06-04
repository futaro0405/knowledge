<route lang="yaml">

meta:

title: 食事記録を報告

requiresAuth: true

requiresNoAuth: false

</route>

  

<template>

<IonPage>

<ContainersHeader

title="食事記録を報告"

default-href="/record"

></ContainersHeader>

<IonContent ref="ionContentRef">

<NForm

ref="formRef"

:model="formValue"

:rules="rules"

:show-require-mark="false"

>

<div class="cards">

<IonCard>

<IonCardHeader class="date">

<IonCardTitle>日付を入力する</IonCardTitle>

</IonCardHeader>

<IonCardContent>

<AtomsFormDatepickerFormItem

v-model:value="formValue.date"

presentation="date"

placeholder="00:00"

:max-date="maxDate"

is-label-hidden

/>

</IonCardContent>

</IonCard>

  

<IonCard>

<IonCardHeader>

<IonCardTitle>朝食を食べましたか</IonCardTitle>

</IonCardHeader>

<IonCardContent>

<NRadioGroup v-model:value="isMorningRadio">

<NRadio value="notYet">まだ食べていない</NRadio>

<NRadio :value="true">食べた</NRadio>

<NRadio :value="false">食べなかった</NRadio>

</NRadioGroup>

  

<Transition name="slide-fade">

<div v-if="formValue.isMorning === true" class="meal-details">

<div class="section-title">

朝食の写真をアップロードしてください

</div>

<NFormItem path="morningPhotos" :show-label="false">

<div class="photo-block">

<div

v-if="formValue.morningPhotos.length > 0"

class="photo-list"

>

<div

v-for="(media, i) in formValue.morningPhotos"

:key="media.id"

class="photo-item"

>

<img :src="media.mediaPath || ''" />

<button

type="button"

class="remove-btn"

aria-label="写真を削除"

@click="formValue.morningPhotos.splice(i, 1)"

></button>

</div>

</div>

  

<div class="upload-actions">

<IonButton

v-if="formValue.missedMorningPhoto === false"

class="add-photo-btn"

fill="clear"

@click="capturePhoto('Morning')"

><IonIcon :icon="AddIcon" />写真を追加する</IonButton

>

  

<AtomsFormCheckbox

v-if="formValue.morningPhotos.length === 0"

v-model:value="formValue.missedMorningPhoto"

>写真を撮り忘れた</AtomsFormCheckbox

>

</div>

</div>

</NFormItem>

  

<div class="section-title">

朝食になぜそれを選びましたか？

</div>

<NFormItem :show-label="false" path="morningMemo">

<NInput

v-model:value="formValue.morningMemo"

type="textarea"

placeholder="写真を撮り忘れた場合、何を食べたのかを併せて記入してください。"

:rows="4"

:maxlength="255"

></NInput>

</NFormItem>

</div>

</Transition>

</IonCardContent>

</IonCard>

  

<IonCard>

<IonCardHeader>

<IonCardTitle>昼食を食べましたか</IonCardTitle>

</IonCardHeader>

<IonCardContent>

<NRadioGroup v-model:value="isLunchRadio">

<NRadio value="notYet">まだ食べていない</NRadio>

<NRadio :value="true">食べた</NRadio>

<NRadio :value="false">食べなかった</NRadio>

</NRadioGroup>

</IonCardContent>

</IonCard>

  

<Transition name="slide-fade">

<IonCard v-if="formValue.isLunch === true">

<IonCardHeader>

<IonCardTitle

>昼食の写真をアップロードしてください</IonCardTitle

>

</IonCardHeader>

<IonCardContent>

<NFormItem path="lunchPhotos" :show-label="false">

<div class="photo-block">

<div

v-if="formValue.lunchPhotos.length > 0"

class="photo-list"

>

<div

v-for="(media, i) in formValue.lunchPhotos"

:key="media.id"

class="photo-item"

>

<img :src="media.mediaPath || ''" />

<button

type="button"

class="remove-btn"

aria-label="写真を削除"

@click="formValue.lunchPhotos.splice(i, 1)"

></button>

</div>

</div>

  

<div class="upload-actions">

<IonButton

v-if="formValue.missedLunchPhoto === false"

class="add-photo-btn"

fill="clear"

@click="capturePhoto('Lunch')"

><IonIcon :icon="AddIcon" />写真を追加する</IonButton

>

<AtomsFormCheckbox

v-if="formValue.lunchPhotos.length === 0"

v-model:value="formValue.missedLunchPhoto"

>写真を撮り忘れた</AtomsFormCheckbox

>

</div>

</div>

</NFormItem>

</IonCardContent>

</IonCard>

</Transition>

  

<Transition name="slide-fade">

<IonCard v-if="formValue.isLunch === true">

<IonCardHeader>

<IonCardTitle>昼食になぜそれを選びましたか？</IonCardTitle>

</IonCardHeader>

<IonCardContent>

<NFormItem :show-label="false" path="lunchMemo">

<NInput

v-model:value="formValue.lunchMemo"

type="textarea"

placeholder="写真を撮り忘れた場合、何を食べたのかを併せて記入してください。"

:rows="4"

:maxlength="255"

></NInput>

</NFormItem>

</IonCardContent>

</IonCard>

</Transition>

  

<IonCard>

<IonCardHeader>

<IonCardTitle>夕食を食べましたか</IonCardTitle>

</IonCardHeader>

<IonCardContent>

<NRadioGroup v-model:value="isDinnerRadio">

<NRadio value="notYet">まだ食べていない</NRadio>

<NRadio :value="true">食べた</NRadio>

<NRadio :value="false">食べなかった</NRadio>

</NRadioGroup>

</IonCardContent>

</IonCard>

  

<Transition name="slide-fade">

<IonCard v-if="formValue.isDinner === true">

<IonCardHeader>

<IonCardTitle

>夕食の写真をアップロードしてください</IonCardTitle

>

</IonCardHeader>

<IonCardContent>

<NFormItem path="dinnerPhotos" :show-label="false">

<div class="photo-block">

<div

v-if="formValue.dinnerPhotos.length > 0"

class="photo-list"

>

<div

v-for="(media, i) in formValue.dinnerPhotos"

:key="media.id"

class="photo-item"

>

<img :src="media.mediaPath || ''" />

<button

type="button"

class="remove-btn"

aria-label="写真を削除"

@click="formValue.dinnerPhotos.splice(i, 1)"

></button>

</div>

</div>

  

<div class="upload-actions">

<IonButton

v-if="formValue.missedDinnerPhoto === false"

class="add-photo-btn"

fill="clear"

@click="capturePhoto('Dinner')"

><IonIcon :icon="AddIcon" />写真を追加する</IonButton

>

<AtomsFormCheckbox

v-if="formValue.dinnerPhotos.length === 0"

v-model:value="formValue.missedDinnerPhoto"

>写真を撮り忘れた</AtomsFormCheckbox

>

</div>

</div>

</NFormItem>

</IonCardContent>

</IonCard>

</Transition>

  

<Transition name="slide-fade">

<IonCard v-if="formValue.isDinner === true">

<IonCardHeader>

<IonCardTitle>夕食になぜそれを選びましたか？</IonCardTitle>

</IonCardHeader>

<IonCardContent>

<NFormItem :show-label="false" path="dinnerMemo">

<NInput

v-model:value="formValue.dinnerMemo"

type="textarea"

placeholder="写真を撮り忘れた場合、何を食べたのかを併せて記入してください。"

:rows="4"

:maxlength="255"

></NInput>

</NFormItem>

</IonCardContent>

</IonCard>

</Transition>

  

<IonCard>

<IonCardHeader>

<IonCardTitle>間食を食べましたか</IonCardTitle>

</IonCardHeader>

<IonCardContent>

<NRadioGroup v-model:value="formValue.isSnack">

<NRadio :value="true">食べた</NRadio>

<NRadio :value="false">食べなかった</NRadio>

</NRadioGroup>

</IonCardContent>

</IonCard>

  

<Transition name="slide-fade">

<IonCard v-if="formValue.isSnack === true">

<IonCardHeader>

<IonCardTitle

>間食の写真をアップロードしてください</IonCardTitle

>

</IonCardHeader>

<IonCardContent>

<NFormItem path="snackPhotos" :show-label="false">

<div class="photo-block">

<div

v-if="formValue.snackPhotos.length > 0"

class="photo-list"

>

<div

v-for="(media, i) in formValue.snackPhotos"

:key="media.id"

class="photo-item"

>

<img :src="media.mediaPath || ''" />

<button

type="button"

class="remove-btn"

aria-label="写真を削除"

@click="formValue.snackPhotos.splice(i, 1)"

></button>

</div>

</div>

  

<div class="upload-actions">

<IonButton

v-if="formValue.missedSnackPhoto === false"

class="add-photo-btn"

fill="clear"

@click="capturePhoto('Snack')"

><IonIcon :icon="AddIcon" />写真を追加する</IonButton

>

<AtomsFormCheckbox

v-if="formValue.snackPhotos.length === 0"

v-model:value="formValue.missedSnackPhoto"

>写真を撮り忘れた</AtomsFormCheckbox

>

</div>

</div>

</NFormItem>

</IonCardContent>

</IonCard>

</Transition>

  

<Transition name="slide-fade">

<IonCard v-if="formValue.isSnack === true">

<IonCardHeader>

<IonCardTitle>間食になぜそれを選びましたか？</IonCardTitle>

</IonCardHeader>

<IonCardContent>

<NFormItem :show-label="false" path="snackMemo">

<NInput

v-model:value="formValue.snackMemo"

type="textarea"

placeholder="写真を撮り忘れた場合、何を食べたのかを併せて記入してください。"

:rows="4"

:maxlength="255"

></NInput>

</NFormItem>

</IonCardContent>

</IonCard>

</Transition>

</div>

</NForm>

<div align="center" mt="24px">

<IonButton size="default" color="btn-primary" @click="submit"

>報告する</IonButton

>

</div>

</IonContent>

</IonPage>

</template>

  

<script setup lang="ts">

import { onIonViewDidLeave, onIonViewWillEnter, useIonRouter } from '@ionic/vue'

import type { FormInst, FormRules } from 'naive-ui'

import { Camera, CameraResultType } from '@capacitor/camera'

import dayjs from 'dayjs'

import { useApi } from '~/api'

import AddIcon from '~/assets/images/icon/add.svg'

import { Media } from '~/models/media'

import { RequiredRule } from '~/logic/formRule'

type MealStatus = boolean | 'notYet'

type MealType = 'Morning' | 'Lunch' | 'Dinner' | 'Snack'

  

interface FormValue {

date: string

  

isMorning: MealStatus

missedMorningPhoto: boolean

morningMemo: string

morningPhotos: Media[]

  

isLunch: MealStatus

missedLunchPhoto: boolean

lunchMemo: string

lunchPhotos: Media[]

  

isDinner: MealStatus

missedDinnerPhoto: boolean

dinnerMemo: string

dinnerPhotos: Media[]

  

isSnack: MealStatus

missedSnackPhoto: boolean

snackMemo: string

snackPhotos: Media[]

}

  

const api = useApi()

const router = useIonRouter()

const ionContentRef = ref<HTMLIonContentElement>()

const maxDate = ref<string>(dayjs().format('YYYY-MM-DD'))

const formRef = ref<FormInst>()

  

const formValue = ref<FormValue>({

date: dayjs().format('YYYY-MM-DD'),

isMorning: 'notYet',

missedMorningPhoto: false,

morningMemo: '',

morningPhotos: [] as Media[],

  

isLunch: 'notYet',

missedLunchPhoto: false,

lunchMemo: '',

lunchPhotos: [] as Media[],

  

isDinner: 'notYet',

missedDinnerPhoto: false,

dinnerMemo: '',

dinnerPhotos: [] as Media[],

  

isSnack: false,

missedSnackPhoto: false,

snackMemo: '',

snackPhotos: [] as Media[],

})

// ------------------------------------------------------------------

// バリデーションルール

// ------------------------------------------------------------------

const rules: FormRules = {

// ----------------------------------------------------------------

// 写真アップロード必須チェック

// - 「食べた」を選択、写真がゼロ枚、かつ「写真を撮り忘れた」が OFF

// ----------------------------------------------------------------

morningPhotos: [

{

trigger: ['change', 'input', 'blur'],

validator: (_rule, value: Media[]) =>

!(

formValue.value.isMorning === true &&

value.length === 0 &&

!formValue.value.missedMorningPhoto

),

message: '写真を追加してください',

},

],

lunchPhotos: [

{

trigger: ['change', 'input', 'blur'],

validator: (_rule, value: Media[]) =>

!(

formValue.value.isLunch === true &&

value.length === 0 &&

!formValue.value.missedLunchPhoto

),

message: '写真を追加してください',

},

],

dinnerPhotos: [

{

trigger: ['change', 'input', 'blur'],

validator: (_rule, value: Media[]) =>

!(

formValue.value.isDinner === true &&

value.length === 0 &&

!formValue.value.missedDinnerPhoto

),

message: '写真を追加してください',

},

],

snackPhotos: [

{

trigger: ['change', 'input', 'blur'],

validator: (_rule, value: Media[]) =>

!(

formValue.value.isSnack === true &&

value.length === 0 &&

!formValue.value.missedSnackPhoto

),

message: '写真を追加してください',

},

],

  

// ----------------------------------------------------------------

// 写真を撮り忘れた場合は理由必須

// ----------------------------------------------------------------

morningMemo: [RequiredRule('理由')],

lunchMemo: [RequiredRule('理由')],

dinnerMemo: [RequiredRule('理由')],

snackMemo: [RequiredRule('理由')],

}

  

// formValue の定義の直後に追記

const isMorningRadio = computed<MealStatus>({

get: () =>

formValue.value.isMorning == null ? 'notYet' : formValue.value.isMorning,

set: (v) => (formValue.value.isMorning = v ?? 'notYet'),

})

const isLunchRadio = computed<MealStatus>({

get: () =>

formValue.value.isLunch == null ? 'notYet' : formValue.value.isLunch,

set: (v) => (formValue.value.isLunch = v ?? 'notYet'),

})

const isDinnerRadio = computed<MealStatus>({

get: () =>

formValue.value.isDinner == null ? 'notYet' : formValue.value.isDinner,

set: (v) => (formValue.value.isDinner = v ?? 'notYet'),

})

  

const capturePhoto = async (meal: MealType) => {

try {

const camera = await Camera.getPhoto({

quality: 100,

allowEditing: true,

resultType: CameraResultType.Base64,

promptLabelHeader: '写真',

promptLabelPicture: '写真を撮る',

promptLabelPhoto: 'カメラロールから選択',

promptLabelCancel: 'キャンセル',

})

  

if (camera.base64String) {

const res = await api.v2.user.image.upload.post({

body: {

images: [camera.base64String],

},

})

switch (meal) {

case 'Morning':

formValue.value.missedMorningPhoto = false

formValue.value.morningPhotos.push(

...res.body.data.images.map((m) => new Media(m)),

)

break

case 'Lunch':

formValue.value.missedLunchPhoto = false

formValue.value.lunchPhotos.push(

...res.body.data.images.map((m) => new Media(m)),

)

break

case 'Dinner':

formValue.value.missedDinnerPhoto = false

formValue.value.dinnerPhotos.push(

...res.body.data.images.map((m) => new Media(m)),

)

break

case 'Snack':

formValue.value.missedSnackPhoto = false

formValue.value.snackPhotos.push(

...res.body.data.images.map((m) => new Media(m)),

)

break

}

}

} catch (e) {

console.error(e)

}

}

  

const submit = async () => {

if (!formRef.value) {

return

}

try {

await formRef.value.validate()

  

await api.v2.user.data_input.meal_log.register.post({

body: {

date: formValue.value.date,

// 食べたかどうか

isMorning:

formValue.value.isMorning === 'notYet'

? undefined

: formValue.value.isMorning,

isLunch:

formValue.value.isLunch === 'notYet'

? undefined

: formValue.value.isLunch,

isDinner:

formValue.value.isDinner === 'notYet'

? undefined

: formValue.value.isDinner,

isSnack: formValue.value.isSnack === true,

// 写真を撮り忘れたかどうか

isMorningPhoto:

formValue.value.isMorning === true

? !formValue.value.missedMorningPhoto

: false,

isLunchPhoto:

formValue.value.isLunch === true

? !formValue.value.missedLunchPhoto

: false,

isDinnerPhoto:

formValue.value.isDinner === true

? !formValue.value.missedDinnerPhoto

: false,

isSnackPhoto:

formValue.value.isSnack === true

? !formValue.value.missedSnackPhoto

: false,

// 理由

morningMemo: formValue.value.morningMemo,

lunchMemo: formValue.value.lunchMemo,

dinnerMemo: formValue.value.dinnerMemo,

snackMemo: formValue.value.snackMemo,

// 写真

morningPhotos: formValue.value.morningPhotos.map((p) => p.id),

lunchPhotos: formValue.value.lunchPhotos.map((p) => p.id),

dinnerPhotos: formValue.value.dinnerPhotos.map((p) => p.id),

snackPhotos: formValue.value.snackPhotos.map((p) => p.id),

},

})

await router.push({

path: '/record/meal-report/complete',

query: {

date: dayjs(formValue.value.date).format('YYYY-MM-DD'),

},

})

  

ionContentRef.value?.scrollToTop()

} catch (e) {

console.error(e)

}

}

  

const loadMealLog = async (date: string) => {

try {

const res = await api.v2.user.data_input.meal_log.detail.get({

query: { date },

})

  

const mealLog = res.body.data?.mealLog

  

if (!mealLog) {

// 該当日のログが無い場合はすべて初期化（date は維持）

formValue.value = {

...formValue.value,

isMorning: 'notYet',

morningMemo: '',

isLunch: 'notYet',

lunchMemo: '',

isDinner: 'notYet',

dinnerMemo: '',

isSnack: false,

snackMemo: '',

morningPhotos: [],

lunchPhotos: [],

dinnerPhotos: [],

snackPhotos: [],

}

return

}

  

// API は boolean | null を返す想定

formValue.value = {

...formValue.value,

isMorning: mealLog.isMorning ?? 'notYet',

isLunch: mealLog.isLunch ?? 'notYet',

isDinner: mealLog.isDinner ?? 'notYet',

isSnack: mealLog.isSnack ?? false,

missedMorningPhoto:

(mealLog.morningPhotos?.length ?? 0) > 0

? false

: mealLog.isMorning !== true

? false

: !(mealLog.isMorningPhoto ?? false),

missedLunchPhoto:

(mealLog.lunchPhotos?.length ?? 0) > 0

? false

: mealLog.isLunch !== true

? false

: !(mealLog.isLunchPhoto ?? false),

missedDinnerPhoto:

(mealLog.dinnerPhotos?.length ?? 0) > 0

? false

: mealLog.isDinner !== true

? false

: !(mealLog.isDinnerPhoto ?? false),

missedSnackPhoto:

(mealLog.snackPhotos?.length ?? 0) > 0

? false

: mealLog.isSnack !== true

? false

: !(mealLog.isSnackPhoto ?? false),

morningMemo: mealLog.morningMemo ?? '',

lunchMemo: mealLog.lunchMemo ?? '',

dinnerMemo: mealLog.dinnerMemo ?? '',

snackMemo: mealLog.snackMemo ?? '',

  

morningPhotos: (mealLog.morningPhotos ?? [])

.filter((p) => p.photo)

.sort((a, b) => {

const ka = a.photo?.offeredAt ?? a.photo?.id ?? ''

const kb = b.photo?.offeredAt ?? b.photo?.id ?? ''

return ka < kb ? -1 : ka > kb ? 1 : 0

})

.map((p) => new Media(p.photo)),

lunchPhotos: (mealLog.lunchPhotos ?? [])

.filter((p) => p.photo)

.sort((a, b) => {

const ka = a.photo?.offeredAt ?? a.photo?.id ?? ''

const kb = b.photo?.offeredAt ?? b.photo?.id ?? ''

return ka < kb ? -1 : ka > kb ? 1 : 0

})

.map((p) => new Media(p.photo)),

dinnerPhotos: (mealLog.dinnerPhotos ?? [])

.filter((p) => p.photo)

.sort((a, b) => {

const ka = a.photo?.offeredAt ?? a.photo?.id ?? ''

const kb = b.photo?.offeredAt ?? b.photo?.id ?? ''

return ka < kb ? -1 : ka > kb ? 1 : 0

})

.map((p) => new Media(p.photo)),

snackPhotos: (mealLog.snackPhotos ?? [])

.filter((p) => p.photo)

.sort((a, b) => {

const ka = a.photo?.offeredAt ?? a.photo?.id ?? ''

const kb = b.photo?.offeredAt ?? b.photo?.id ?? ''

return ka < kb ? -1 : ka > kb ? 1 : 0

})

.map((p) => new Media(p.photo)),

}

} catch (e) {

console.error(e)

}

}

  

onIonViewDidLeave(() => {

formValue.value = {

date: dayjs().format('YYYY-MM-DD'),

isMorning: 'notYet',

missedMorningPhoto: false,

morningMemo: '',

morningPhotos: [],

isLunch: 'notYet',

missedLunchPhoto: false,

lunchMemo: '',

lunchPhotos: [],

isDinner: 'notYet',

missedDinnerPhoto: false,

dinnerMemo: '',

dinnerPhotos: [],

isSnack: false,

missedSnackPhoto: false,

snackMemo: '',

snackPhotos: [],

}

})

  

onIonViewWillEnter(async () => {

await loadMealLog(formValue.value.date)

})

  

watch(

() => formValue.value.date,

async (newDate) => {

await loadMealLog(newDate)

formRef.value?.restoreValidation()

},

)

</script>

  

<style scoped lang="scss">

ion-content {

--padding-start: 32px;

--padding-end: 32px;

--padding-top: 16px;

--padding-bottom: 30px;

}

  

.cards {

display: flex;

flex-direction: column;

gap: 16px;

}

  

ion-card {

border-radius: 21px;

}

  

ion-card-header {

padding: 20px 20px 16px;

  

&.date {

padding: 20px 24px 16px;

}

}

  

ion-card-title {

font-size: 16px;

line-height: 19px;

font-weight: bold;

}

  

.n-radio-group {

display: flex;

flex-direction: column;

}

  

.n-radio {

--n-label-line-height: 24px !important;

  

&:not(:first-child) {

margin-top: 20px;

}

}

  

.selected-photos {

display: flex;

gap: 12px;

flex-wrap: wrap;

margin-bottom: 16px;

}

  

.photo-list {

display: flex;

flex-flow: row nowrap;

gap: 16px;

margin-bottom: 20px;

overflow-x: auto;

overflow-y: hidden;

}

  

::v-deep(.n-form-item:has(.photo-list) .n-form-item-blank) {

flex-direction: column;

align-items: stretch;

}

  

.photo-item {

position: relative;

width: 100px;

aspect-ratio: 1 / 1;

flex: 0 0 auto;

}

  

.photo-block {

display: flex;

flex-direction: column;

}

  

.photo-item img {

width: 100%;

height: 100%;

object-fit: cover;

}

  

.remove-btn {

position: absolute;

top: 0;

right: 0;

border: 2px solid #f70;

color: #f70;

border-radius: 50%;

background-color: rgba(255, 255, 255, 0.75);

width: 24px;

height: 24px;

}

  

.remove-btn::before,

.remove-btn::after {

content: '';

position: absolute;

top: 50%;

left: 50%;

width: 12px;

height: 2px;

background-color: #f70;

}

  

.remove-btn::before {

transform: translate(-50%, -50%) rotate(45deg);

}

  

.remove-btn::after {

transform: translate(-50%, -50%) rotate(-45deg);

}

  

.add-photo-btn {

height: 18px;

line-height: 20px;

font-size: 16px;

font-weight: 400;

  

--padding-start: 0;

--padding-end: 0;

--color: #f70;

  

ion-icon {

font-size: 18px;

margin-right: 12px;

}

}

  

.n-upload-list-item-icon {

width: 120px;

height: 120px;

}

  

.photo-checkbox {

display: flex;

align-items: center;

}

  

.upload-actions {

display: flex;

flex-direction: column;

gap: 20px;

align-items: flex-start;

}

  

.slide-fade-enter-active,

.slide-fade-leave-active {

transition: all 0.3s ease;

}

  

.slide-fade-enter-from,

.slide-fade-leave-to {

opacity: 0;

transform: translateY(-10px);

}

  

.meal-details {

margin-top: 24px;

margin-left: -20px;

margin-right: -20px;

padding-top: 20px;

padding-left: 20px;

padding-right: 20px;

border-top: 1px solid #e5e5e5;

}

  

.section-title {

font-size: 16px;

line-height: 19px;

font-weight: bold;

margin-bottom: 16px;

color: #333;

}

</style>