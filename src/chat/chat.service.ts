import { ApiError, GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private ai: any;
  constructor(private config: ConfigService) {
    const apiKey = this.config.get('GEMINI_API_KEY');
    this.ai = new GoogleGenAI({
      apiKey,
    });
    this.logger.log('Initialized GoogleGenAI with API key');
  }

  async generateText(
    prompt: string,
    opts?: { model?: string; temperature?: number; maxOutputTokens?: number },
  ) {
    try {
      const model = opts?.model || this.config.get('GENAI_DEFAULT_MODEL');
      const response = await this.ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: opts?.temperature,
          maxOutputTokens: opts?.maxOutputTokens,
        },
      });
      // response.text 是 SDK 常见结构（参见 SDK 示例）
      return { text: response.text, raw: response };
    } catch (e) {
      if (e instanceof ApiError) {
        this.logger.error('GenAI ApiError', e);
        throw e;
      }
      this.logger.error('GenAI unknown error', e);
      throw e;
    }
  }

  // 返回 async iterator（stream）
  async streamGenerate(
    prompt: string,
    opts?: { model?: string; temperature?: number; maxOutputTokens?: number },
  ) {
    const model =
      opts?.model ||
      this.config.get('GENAI_DEFAULT_MODEL') ||
      'gemini-2.0-flash-001';
    try {
      console.log(model);
      const iterator = await this.ai.models.generateContentStream({
        model,
        contents: prompt,
        config: {
          temperature: opts?.temperature,
          maxOutputTokens: opts?.maxOutputTokens,
        },
      });
      console.log(iterator);
      return iterator; // caller will iterate for-await-of
    } catch (error) {
      console.log(error);
    }
  }

  async refinePrompt(input: string) {
    const template = `
      # Role: Prompt分层优化工程师

      ## Profile:
      - Description: 我是一名专业的Prompt优化工程师，擅长处理分层结构的Prompt优化，确保system层级和user层级的清晰分离与协同。

      ### Skills:
      - 精通层级化Prompt结构设计，能准确区分system和user层级的职责
      - 掌握宏观描述和微观细节的平衡处理技巧
      - 精通语言逻辑分析和重构，能够使表达更加清晰流畅
      - 擅长内容整合与归类，能够识别并合并相似概念
      - 具备将抽象概念具象化的能力，善于举例说明
      - 掌握格式规范和变量处理技巧
      - 熟练运用人称统一技巧，确保文本连贯性

      ## Goals:
      - 明确区分并维护system和user两个层级的内容定位
      - 确保system层级保持宏观指导性
      - 保证user层级包含具体操作细节
      - 优化Prompt的语言表达，确保逻辑清晰连贯
      - 识别并合并内容相似的部分，提高文本简洁度
      - 为抽象表达提供具体解释和示例
      - 统一使用第二人称"you"
      - 保持原有格式和变量完整性

      ## Constrains:
      1. 区分system和user两个层级的内容，并调整结构
      2. 确保system层级保持抽象和指导性质
      3. 保持user层级的具体和操作性质
      5. 保持【【变量】】和{{#变量#}}格式的变量内容不变
      6. 保持原有语言不变
      7. 确保修改后的内容逻辑性更强
      8. 避免添加或删除核心信息

      用户输入:${input}
    `;
    const model = 'gemini-2.0-flash-001';
    const response = await this.ai.models.generateContent({
      model,
      contents: template,
    });

    console.log(response);
    return response;
  }
}
