<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="email" class="enter-x">
        <Input size="large" v-model:value="formData.email" :placeholder="t('sys.login.email')" />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.newPassword')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>
      <!-- <FormItem name="mobile" class="enter-x">
        <Input size="large" v-model:value="formData.mobile" :placeholder="t('sys.login.mobile')" />
      </FormItem> -->
      <FormItem name="code" class="enter-x">
        <CountdownInput
          size="large"
          v-model:value="formData.code"
          :sendCodeApi="sendCodeApi"
          :placeholder="t('sys.login.emailCode')"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleReset" :loading="loading">
          {{ t('common.resetText') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, LoginStateEnum, useFormValid } from './useLogin';
  import { api_login } from '/@/api';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    email: '',
    password: '',
    confirmPassword: '',
    // mobile: '',
    code: '',
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

  async function sendCodeApi() {
    const data = await validForm();
    if (!data) return;
    await api_login({
      type: 3,
      email: data.email,
      password: data.password,
    });

    createMessage.success(t('sys.api.operationSuccess'));
  }

  async function handleReset() {
    const data = await validForm();
    if (!data) return;
    if (!data.code) {
      createMessage.warn(t('sys.api.operationSuccess'));
      return;
    }
    await api_login({
      type: 3,
      email: data.email,
      password: data.password,
      code: data.code,
    });
    formData.email = '';
    formData.password = '';
    formData.confirmPassword = '';
    formData.code = '';
    createMessage.success(t('sys.api.operationSuccess'));
  }
</script>
