import type { ValidationRule, FormInstance } from 'ant-design-vue/lib/form/Form';
import type { RuleObject, NamePath } from 'ant-design-vue/lib/form/interface';
import { ref, computed, unref, Ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

export enum LoginStateEnum {
  LOGIN,
  EMAIL_LOGIN,
  REGISTER,
  CODE,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

const currentState = ref(LoginStateEnum.LOGIN);

// 这里也可以优化
// import { createGlobalState } from '@vueuse/core'

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state;
  }

  const getLoginState = computed(() => currentState.value);

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<FormInstance>) {
  const validate = computed(() => {
    const form = unref(formRef);
    return form?.validate ?? ((_nameList?: NamePath) => Promise.resolve());
  });

  async function validForm() {
    const form = unref(formRef);
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validate, validForm };
}

export function useFormRules(formData?: Recordable) {
  const { t } = useI18n();

  // const getAccountFormRule = computed(() => createRule(t('sys.login.accountPlaceholder')));
  const getPasswordFormRule = computed(() => createRule(t('sys.login.passwordPlaceholder')));
  const getSmsFormRule = computed(() => createRule(t('sys.login.smsPlaceholder')));
  const getMobileFormRule = computed(() => createRule(t('sys.login.mobilePlaceholder')));

  const validatePolicy = async (_: RuleObject, value: boolean) => {
    return !value ? Promise.reject(t('sys.login.policyPlaceholder')) : Promise.resolve();
  };

  const validateConfirmPassword = (password: string) => {
    return async (_: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject(t('sys.login.passwordPlaceholder'));
      }
      if (value !== password) {
        return Promise.reject(t('sys.login.diffPwd'));
      }
      return Promise.resolve();
    };
  };

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    // const accountFormRule = unref(getAccountFormRule);
    const passwordFormRule = unref(getPasswordFormRule);
    const smsFormRule = unref(getSmsFormRule);
    const mobileFormRule = unref(getMobileFormRule);

    const mobileRule = {
      sms: smsFormRule,
      mobile: mobileFormRule,
    };
    switch (unref(currentState)) {
      // register form rules
      case LoginStateEnum.REGISTER:
        return {
          // account: accountFormRule,
          email: [
            {
              required: true,
              type: 'email',
              message: t('sys.login.emailPlaceholder'),
              trigger: 'change',
            },
          ],
          code: [
            {
              required: true,
              message: t('sys.login.smsPlaceholder'),
              trigger: 'change',
            },
          ],
          password: passwordFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          policy: [{ validator: validatePolicy, trigger: 'change' }],
          company: [
            {
              required: true,
              message: t('sys.login.companyPlaceholder'),
              trigger: 'change',
            },
          ],
          // ...mobileRule,
        };

      // reset password form rules
      case LoginStateEnum.RESET_PASSWORD:
        return {
          // account: accountFormRule,
          // ...mobileRule,
          email: [
            {
              required: true,
              type: 'email',
              message: t('sys.login.emailPlaceholder'),
              trigger: 'change',
            },
          ],
          // code: [
          //   {
          //     required: true,
          //     message: t('sys.login.smsPlaceholder'),
          //     trigger: 'change',
          //   },
          // ],
          password: passwordFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
        };
      // reset password form rules
      case LoginStateEnum.LOGIN:
        return {
          email: [
            {
              required: true,
              type: 'email',
              message: t('sys.login.emailPlaceholder'),
              trigger: 'change',
            },
          ],
          password: passwordFormRule,
        };
      // reset password form rules
      case LoginStateEnum.EMAIL_LOGIN:
        return {
          email: [
            {
              required: true,
              type: 'email',
              message: t('sys.login.emailPlaceholder'),
              trigger: 'change',
            },
          ],
        };

      // mobile form rules
      case LoginStateEnum.MOBILE:
        return mobileRule;

      // login form rules
      default:
        return {
          // account: accountFormRule,
          email: [
            {
              required: true,
              type: 'email',
              message: t('sys.login.emailPlaceholder'),
              trigger: 'change',
            },
          ],
          password: passwordFormRule,
        };
    }
  });
  return { getFormRules };
}

function createRule(message: string) {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ];
}
