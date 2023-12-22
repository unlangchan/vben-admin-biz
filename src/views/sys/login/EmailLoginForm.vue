<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="email" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.email"
        :placeholder="t('sys.login.email')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="code" class="enter-x">
      <CountdownInput
        size="large"
        class="fix-auto-fill"
        v-model:value="formData.code"
        :sendCodeApi="sendCodeApi"
        :placeholder="t('sys.login.emailCode')"
      />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </FormItem>
    <ARow class="enter-x">
      <!-- <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('sys.login.mobileSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('sys.login.qrSignInFormTitle') }}
        </Button>
      </ACol> -->
      <ACol :md="6" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('sys.login.registerButton') }}
        </Button>
      </ACol>
    </ARow>

    <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <ACol :md="12" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.LOGIN)">
          {{ t('sys.login.passwordSignInFormTitle') }}
        </Button>
      </ACol>
      <!-- <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled /> -->
    </div>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import { Checkbox, Form, Input, Row, Col, Button, Divider } from 'ant-design-vue';
  import {
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { CountdownInput } from '/@/components/CountDown';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { api_login } from '/@/api';
  //import { onKeyStroke } from '@vueuse/core';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal, createMessage } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(true);

  const formData = reactive({
    email: localStorage.getItem('emailcache') || '',
    code: '',
  });

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.EMAIL_LOGIN);

  async function sendCodeApi() {
    const data = await validForm();
    if (!data) return;
    await api_login({
      type: 2,
      email: data.email,
    });
    createMessage.success(t('sys.api.operationSuccess'));
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    if (!data.code) {
      createMessage.warn(t('sys.api.operationSuccess'));
      return;
    }
    try {
      loading.value = true;
      const userInfo = await api_login({
        type: 2,
        email: data.email,
        code: data.code,
      });
      if (rememberMe.value) {
        localStorage.setItem('emailcache', data.email);
      } else {
        localStorage.setItem('emailcache', '');
      }
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          ...userInfo,
          avatar: '',
          username: userInfo.userName,
          realName: userInfo.userName,
          desc: userInfo.description,
          homePath: '/fund-management/demo1',
          roles: [
            {
              roleName: 'Super Admin',
              value: 'super',
            },
          ],
        }),
      );
      await userStore.setToken(userInfo.token);
      await userStore.afterLoginAction(true);
      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}`,
        duration: 3,
      });
    } catch (error) {
      // createErrorModal({
      //   title: t('sys.api.errorTip'),
      //   content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      //   getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      // });
    } finally {
      loading.value = false;
    }
  }
</script>
