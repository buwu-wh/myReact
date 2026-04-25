#!/bin/bash

# ============================================
# 前端项目构建脚本
# 功能：安装依赖、代码检查、单元测试、打包构建
# ============================================

# 设置错误时退出
set -e

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 检查 Node.js 版本
check_node_version() {
    REQUIRED_NODE_VERSION="14.0.0"
    CURRENT_NODE_VERSION=$(node -v | cut -d'v' -f2)
    
    if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$CURRENT_NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE_VERSION" ]; then
        print_error "Node.js 版本必须 >= $REQUIRED_NODE_VERSION，当前版本: $CURRENT_NODE_VERSION"
        exit 1
    fi
    print_info "Node.js 版本: $CURRENT_NODE_VERSION"
}

# 清理旧的构建文件
clean() {
    print_info "清理旧的构建文件..."
    rm -rf ../dist/
    rm -rf ../node_modules/.vite
    print_info "清理完成"
}

# 安装依赖
install_dependencies() {
    print_info "开始安装依赖..."
    
    # 优先使用 pnpm，然后 yarn，最后 npm
    print_info "使用 npm 安装依赖"
    npm ci
    
    print_info "依赖安装完成"
}

# 代码检查
lint() {
    print_info "开始代码检查..."
    
    if [ -f "package.json" ]; then
        # 检查是否有 lint 脚本
        if grep -q "\"lint\"" package.json; then
            npm run lint
            print_info "代码检查通过"
        else
            print_warning "未找到 lint 脚本，跳过代码检查"
        fi
    fi
}

# 运行单元测试
test() {
    print_info "开始运行单元测试..."
    
    if [ -f "package.json" ]; then
        if grep -q "\"test\"" package.json; then
            npm run test -- --watchAll=false --coverage
            print_info "单元测试通过"
        else
            print_warning "未找到 test 脚本，跳过测试"
        fi
    fi
}

# 构建项目
build() {
    print_info "开始构建项目..."
    
    # 设置环境变量
    export NODE_ENV=production
    
    # 根据构建参数设置不同环境
    case "$1" in
        dev)
            export REACT_APP_ENV=development
            print_info "构建环境: 开发环境"
            ;;
        staging)
            export REACT_APP_ENV=staging
            print_info "构建环境: 预发布环境"
            ;;
        prod)
            export REACT_APP_ENV=production
            print_info "构建环境: 生产环境"
            ;;
        *)
            print_info "构建环境: 默认环境"
            ;;
    esac
    
    # 执行构建命令
    npm run build
    
    # 检查构建结果
    if [ -d "dist" ] || [ -d "build" ]; then
        BUILD_DIR="dist"
        if [ -d "build" ]; then
            BUILD_DIR="build"
        fi
        
        print_info "构建成功！构建文件位于: $BUILD_DIR/"
        
        # 显示构建文件大小
        print_info "构建文件大小信息："
        if command -v du &> /dev/null; then
            du -sh $BUILD_DIR/
        fi
    else
        print_error "构建失败，未找到输出目录"
        exit 1
    fi
}

# 备份当前构建
backup() {
    if [ -d "dist" ] && [ "$1" == "prod" ]; then
        BACKUP_DIR="backups/dist_$(date +%Y%m%d_%H%M%S)"
        print_info "备份当前构建到 $BACKUP_DIR"
        mkdir -p backups
        cp -r dist $BACKUP_DIR
    fi
}

# 显示帮助信息
show_help() {
    echo "使用方法: $0 [选项] [环境]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -s, --skip-test 跳过测试"
    echo "  -c, --clean-only 只清理，不构建"
    echo ""
    echo "环境参数:"
    echo "  dev    开发环境"
    echo "  staging 预发布环境"
    echo "  prod   生产环境"
    echo ""
    echo "示例:"
    echo "  $0 prod              # 生产环境构建"
    echo "  $0 -s staging        # 预发布环境构建，跳过测试"
    echo "  $0 -c                # 只清理构建文件"
}

# 主函数
main() {
    print_info "========================================="
    print_info "开始前端项目构建流程"
    print_info "========================================="
    
    # 解析参数
    SKIP_TEST=false
    CLEAN_ONLY=false
    ENV=""
    echo "测试参数：$@"
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -s|--skip-test)
                SKIP_TEST=true
                shift
                ;;
            -c|--clean-only)
                CLEAN_ONLY=true
                shift
                ;;
            dev|staging|prod)
                ENV=$1
                shift
                ;;
            *)
                print_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 检查必要命令
    check_command node
    check_command npm
    
    # 检查 Node 版本
    check_node_version
    
    # 清理
    clean
    
    # 如果只是清理，直接退出
    if [ "$CLEAN_ONLY" = true ]; then
        print_info "只执行清理操作，退出"
        exit 0
    fi
    
    # 安装依赖
    install_dependencies
    
    # 代码检查
    lint 
    
    # 构建
    build $ENV
    
    print_info "========================================="
    print_info "构建流程全部完成！🎉"
    print_info "========================================="
}

# 捕获错误
trap 'print_error "构建过程中发生错误，脚本已终止"; exit 1' ERR

# 执行主函数
main "$@"