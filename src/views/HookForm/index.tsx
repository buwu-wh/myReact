import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import api from '@/apis/requests/appInfo';

function FirstNameDisplay({ control }) {
  const firstName = useWatch({ name: 'username', control });
  console.log('firstNamevs反是不思');
  return <div>{firstName}</div>;
}
function HookForm() {
  const id = 4;
  const { data } = useQuery({
    queryKey: ['todo', id],
    staleTime: 0,
    queryFn: () => {
      const aa = api.getUserInfo({ id }).then((res) => res.data);
      return aa;
    },
  });
  const {
    register, // 注册输入框（最常用）
    handleSubmit, // 处理表单提交
    formState: {
      // 表单状态（解构）
      errors, // 错误信息
      isSubmitting, // 是否正在提交
      isDirty, // 表单是否被修改过
      isValid, // 表单是否验证通过
      touchedFields, // 哪些字段被触碰过
    },
    reset, // 重置表单
    setValue, // 手动设置值
    getValues, // 获取当前值
    watch, // 监听字段变化
    control, // 用于 Controller（可控组件）
    trigger, // 手动触发验证
    setError, // 手动设置错误
    clearErrors, // 清除错误
  } = useForm({
    values: {
      username: '',
      // 默认值，可以是对象或函数
      // defaultValues: () => ({ username: 'default' }),
      email: '',
      password: '',
      age: '',
      agree: false, // 复选框
      gender: '', // 单选按钮
      remember: false,
    },
    mode: 'onBlur', // 验证模式：onChange | onBlur | onSubmit | onTouched
    reValidateMode: 'onChange', // 重新验证模式
    shouldFocusError: true, // 提交时自动聚焦到错误字段
  });
  console.log('usernamevs反是不思');
  useEffect(() => {
    // 监听表单变化
    if (data) {
      reset(data);
    }
    // const username = watch('username');
    // console.log(username, 'usernamevs反是不思');
  }, [data, reset]);

  const onSubmit = async (dataF) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(dataF); // { email: '...', password: '...', remember: true }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 1. 基础用法 */}
      <ul>
        <li>
          <input {...register('username')} />
        </li>

        {/* 2. 带验证规则 */}
        <li>
          <input
            {...register('email', {
              required: '邮箱不能为空',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '邮箱格式不正确',
              },
            })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </li>

        {/* 3. 复杂验证规则 */}
        <li>
          <input
            type="password"
            {...register('password', {
              required: '密码不能为空',
              validate: {
                noSpace: (value) => !value.includes(' ') || '密码不能包含空格',
                noChinese: (value) =>
                  !/[\u4e00-\u9fa5]/.test(value) || '密码不能包含中文',
                custom: (value) => {
                  // 自定义验证，可以返回 true 或错误信息
                  return value !== '123456' || '密码过于简单';
                },
              },
              minLength: {
                value: 6,
                message: '密码至少6位',
              },
              maxLength: {
                value: 20,
                message: '密码最多20位',
              },
              pattern: {
                value: /(?=.*[A-Za-z])(?=.*\d)/,
                message: '密码必须包含字母和数字',
              },
            })}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </li>
        {/* 4. 数字类型（需要手动转换） */}
        <li>
          <input
            type="number"
            {...register('age', {
              valueAsNumber: true, // 自动转为数字
              min: { value: 0, message: '年龄不能为负数' },
              max: { value: 150, message: '年龄不能超过150' },
            })}
          />
        </li>
        {/* 5. 复选框 */}
        <li>
          <input
            type="checkbox"
            {...register('agree', {
              required: '请同意用户协议',
            })}
          />
        </li>

        {/* 6. 单选框 */}
        <li>
          <select {...register('gender', { required: '请选择性别' })}>
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </li>
        <li>
          <button type="submit" disabled={!isDirty || isSubmitting}>
            注册
          </button>
        </li>
      </ul>
      <FirstNameDisplay control={control} />
    </form>
  );
}

export default HookForm;
