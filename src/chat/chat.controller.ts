import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
  Query,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { GenerateTextDto } from './dto/generate-texxt.dto';
import { map, Observable } from 'rxjs';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 同步（等待完整结果）生成文本
  @Post('text')
  async generateText(@Body() dto: GenerateTextDto) {
    const result = await this.chatService.generateText(dto.prompt, {
      model: dto.model,
      temperature: dto.temperature,
      maxOutputTokens: dto.maxOutputTokens,
    });
    return { ok: true, ...result };
  }

  @Sse('stream')
  stream(@Query() dto: GenerateTextDto) {
    return new Observable((subscriber) => {
      (async () => {
        try {
          const iterator = await this.chatService.streamGenerate(dto.prompt, {
            model: dto.model,
            temperature: dto.temperature,
            maxOutputTokens: dto.maxOutputTokens,
          });

          for await (const chunk of iterator) {
            const text = chunk?.text ?? '';
            subscriber.next({
              data: { text },
            });
          }

          subscriber.complete();
        } catch (e) {
          subscriber.error(e);
        }
      })();
    }).pipe(
      map((data) => ({
        type: 'message', // SSE 默认事件类型
        data,
      })),
    );
  }

  @Post('test/generatePrompt')
  async generatePrompt(@Body() body: { input: string }) {
    return this.chatService.refinePrompt(body.input);
  }
}
