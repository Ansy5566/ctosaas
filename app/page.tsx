import Link from 'next/link';
import { PLATFORM_CONFIG, SUBSCRIPTION_PLANS } from '@/lib/constants';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">商品采集SaaS</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">功能</a>
              <a href="#platforms" className="text-gray-600 hover:text-gray-900">支持平台</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">价格</a>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">登录</Link>
              <Link 
                href="/auth/register" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                免费试用
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            多平台商品采集
            <br />
            <span className="text-blue-600">一站式解决方案</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            支持Shopify、AliExpress、Amazon等多个电商平台的商品数据采集，
            帮助您快速搭建自己的电商网站
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              开始免费试用
            </Link>
            <a 
              href="#features"
              className="px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition border-2 border-gray-200"
            >
              了解更多
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            🎉 免费试用，无需信用卡
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            核心功能
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-semibold mb-2">快速采集</h4>
              <p className="text-gray-600">
                一键采集商品数据，支持单品和分类批量采集，大幅提升工作效率
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="text-xl font-semibold mb-2">多平台支持</h4>
              <p className="text-gray-600">
                支持Shopify、AliExpress、Amazon等主流电商平台
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-semibold mb-2">数据管理</h4>
              <p className="text-gray-600">
                强大的商品管理功能，支持搜索、筛选、批量编辑和导出
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-semibold mb-2">批量操作</h4>
              <p className="text-gray-600">
                批量修改价格、分类、标签，提升数据处理效率
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">📤</div>
              <h4 className="text-xl font-semibold mb-2">灵活导出</h4>
              <p className="text-gray-600">
                支持Shopify、WooCommerce等多种CSV格式导出
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-semibold mb-2">安全可靠</h4>
              <p className="text-gray-600">
                企业级安全保障，数据加密存储，保护您的商业隐私
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            支持的电商平台
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            我们持续增加对更多电商平台的支持，让您的商品采集工作更加便捷
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(PLATFORM_CONFIG).map(([key, platform]) => (
              <div 
                key={key}
                className="p-6 bg-white border border-gray-200 rounded-xl text-center hover:shadow-lg transition"
              >
                <div className="text-4xl mb-2">{platform.icon}</div>
                <h4 className="font-semibold text-gray-900">{platform.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            选择适合您的套餐
          </h3>
          <p className="text-center text-gray-600 mb-12">
            灵活的定价方案，满足不同规模的业务需求
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
              <div 
                key={key}
                className={`p-6 border-2 rounded-xl ${
                  key === 'pro' 
                    ? 'border-blue-600 shadow-xl scale-105' 
                    : 'border-gray-200'
                }`}
              >
                {key === 'pro' && (
                  <div className="text-center mb-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                      推荐
                    </span>
                  </div>
                )}
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h4>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ¥{plan.price}
                  </span>
                  <span className="text-gray-600">/月</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`block w-full py-2 text-center rounded-lg font-semibold transition ${
                    key === 'pro'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {key === 'free' ? '免费开始' : '立即订阅'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            准备好开始了吗？
          </h3>
          <p className="text-xl mb-8 opacity-90">
            立即注册，开启您的商品采集之旅
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
          >
            免费注册
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">商品采集SaaS</h4>
              <p className="text-sm text-gray-600">
                专业的多平台商品采集解决方案
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">产品</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features">功能特性</a></li>
                <li><a href="#platforms">支持平台</a></li>
                <li><a href="#pricing">价格方案</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">支持</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">帮助中心</a></li>
                <li><a href="#">API文档</a></li>
                <li><a href="#">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">公司</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">关于我们</a></li>
                <li><a href="#">隐私政策</a></li>
                <li><a href="#">服务条款</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>© 2024 商品采集SaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
