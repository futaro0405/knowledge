src/components/section/mypage/profileCard.vue
```
<template>
  <IonCard>
    <IonCardContent>
      <IonList>
        <IonListHeader>
          <IonLabel>プロフィール</IonLabel>
          <div class="edit-icon">
            <IonImg v-if="user.icon?.mediaPath" :src="user.icon.mediaPath" />
            <IonImg v-else :src="NoneIcon" />
            <IonButton fill="clear" @click="editIcon">
              <IonIcon :icon="EditIcon" />
            </IonButton>
          </div>
        </IonListHeader>
        <IonItem lines="full" :detail="false">
          <IonLabel>
            <div class="label">ユーザーID</div>
            <div class="value">{{ props.user.displayUserId }}</div>
          </IonLabel>
        </IonItem>
        <IonItem
          button
          lines="full"
          :detail="false"
          @click="toPage('/mypage/nickname')"
        >
          <IonLabel>
            <div class="label">ニックネーム</div>
            <div class="value">
              {{ props.user.handleName ? props.user.handleName : '未設定' }}
            </div>
          </IonLabel>
          <IonIcon slot="end" :icon="ArrowIcon"></IonIcon>
        </IonItem>
        <IonItem
          button
          lines="full"
          :detail="false"
          @click="toPage('/mypage/gender')"
        >
          <IonLabel>
            <div class="label">性別</div>
            <div class="value">{{ gender }}</div>
          </IonLabel>
          <IonIcon slot="end" :icon="ArrowIcon"></IonIcon>
        </IonItem>
        <IonItem
          button
          lines="full"
          :detail="false"
          @click="toPage('/mypage/physical-activity-level')"
        >
          <IonLabel>
            <div class="label">身体活動レベル</div>
            <div class="value">{{ physicalActivityLevel }}</div>
          </IonLabel>
          <IonIcon slot="end" :icon="ArrowIcon"></IonIcon>
        </IonItem>
        <IonItem
          button
          lines="full"
          :detail="false"
          @click="toPage('/mypage/birthday')"
        >
          <IonLabel>
            <div class="label">生年月日</div>
            <div class="value">
              {{
                user.birthday.format('YYYYMMDD') === '19000101'
                  ? '未設定'
                  : user.birthday.format('YYYY年MM月DD日')
              }}
            </div>
          </IonLabel>
          <IonIcon slot="end" :icon="ArrowIcon"></IonIcon>
        </IonItem>
        <IonItem
          button
          lines="full"
          :detail="false"
          @click="toPage('/mypage/email')"
        >
          <IonLabel>
            <div class="label">メールアドレス</div>
            <div class="value">{{ user.mail }}</div>
          </IonLabel>
          <IonIcon slot="end" :icon="ArrowIcon"></IonIcon>
        </IonItem>
        <IonItem
          button
          lines="full"
          :detail="false"
          @click="toPage('/mypage/password')"
        >
          <IonLabel>
            <div class="label">パスワード</div>
            <div class="value">******</div>
          </IonLabel>
          <IonIcon slot="end" :icon="ArrowIcon"></IonIcon>
        </IonItem>
        <IonItem
          button
          lines="full"
          :detail="false"
          @click="toPage('/mypage/coupon')"
        >
          <IonLabel>
            <div class="label">クーポンコード</div>
            <div class="value">
              {{ props.appliedCoupon || '適用なし' }}
            </div>
          </IonLabel>
          <IonIcon slot="end" :icon="ArrowIcon"></IonIcon>
        </IonItem>
      </IonList>
    </IonCardContent>
  </IonCard>
</template>

<script setup lang="ts">
import { useIonRouter } from '@ionic/vue'
import { Camera, CameraResultType } from '@capacitor/camera'
import ArrowIcon from '~/assets/images/icon/setting/arrow.svg'
import EditIcon from '~/assets/images/icon/mypage/edit.svg'
import type { UserDetail } from '~/models/userDetail'
import { GenderLabels } from '~/enums/gender'
import { PhysicalActivityLevelLabels } from '~/enums/physicalActivityLevel'
import { useApi } from '~/api'
import NoneIcon from '~/assets/images/none-icon.png'

interface Props {
  user: UserDetail
  appliedCoupon: string
}

interface GenderOption {
  label: string
  value: string
}

interface PhysicalActivityLevelOption {
  label: string
  value: string
}

const api = useApi()
const props = defineProps<Props>()

const router = useIonRouter()

const genderOptions: GenderOption[] = Object.entries(GenderLabels).map(
  ([value, label]) => ({
    label,
    value,
  }),
)

const PhysicalActivityLevelOptions: PhysicalActivityLevelOption[] =
  Object.entries(PhysicalActivityLevelLabels).map(([value, label]) => ({
    label,
    value,
  }))

const gender = computed((): string => {
  const option = genderOptions.find(
    (option) => option.value === props.user.gender,
  )
  return option ? option.label : '未設定'
})

const physicalActivityLevel = computed((): string => {
  const option = PhysicalActivityLevelOptions.find(
    (option) => Number(option.value) === props.user.physicalActivityLevel,
  )
  return option ? option.label : '未設定'
})
const toPage = (page: string) => {
  router.push(page)
}

const editIcon = async () => {
  try {
    const res = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      promptLabelHeader: '写真',
      promptLabelPicture: '写真を撮る',
      promptLabelPhoto: 'カメラロールから選択',
      promptLabelCancel: 'キャンセル',
    })

    if (res.base64String) {
      await api.v2.user.icon.post({
        body: {
          icon: res.base64String,
        },
      })
    }
  } catch (error) {}
}
</script>

<style scoped lang="scss">
ion-card {
  border-radius: 21px;

  &:not(:first-child) {
    margin-top: 16px;
  }
}

ion-card-content {
  padding: 0 0 20px;
}

ion-list-header {
  padding: 20px 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  align-items: center;
  flex-direction: column;
  border-bottom: 1px solid #ddd;

  --color: #333;

  ion-label {
    margin: 0;
    text-align: center;
    font-weight: bold;
    line-height: 24px;
  }
}

ion-item {
  font-size: 14px;

  --min-height: 82px;
  --padding-start: 20px;
  --border-color: #ddd;
  --border-width: 0 0 1px 0;

  ion-icon {
    color: #aaa;
    font-size: 18px;
  }

  ion-label {
    white-space: initial !important;
    font-weight: 500;
  }
}

.edit-icon {
  position: relative;
  margin-top: 20px;
  width: 80px;
  height: 80px;

  ion-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    overflow: hidden;
  }

  ion-button {
    position: absolute;
    bottom: 0;
    right: 0;
    height: initial;
    border-radius: 50%;

    --padding-start: 0;
    --padding-end: 0;

    ion-icon {
      font-size: 32px;
    }
  }
}

.label {
  font-size: 13px;
  line-height: 13px;
  color: #727272;
  font-weight: 400;
}

.value {
  font-size: 13px;
  line-height: 15px;
  margin-top: 8px;
  font-weight: 500;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
```
