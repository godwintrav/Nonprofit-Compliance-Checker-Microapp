import { IsString, Matches} from 'class-validator';

export class GetOrganizationByEinDto {
  @IsString()
  @Matches(/^\d{9}$/, { message: 'EIN must be exactly 9 digits' })
  ein: string;
}
