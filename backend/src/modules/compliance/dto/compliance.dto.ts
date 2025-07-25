import { IsString, Matches, Length } from 'class-validator';

export class GetOrganizationByEinDto {
  @IsString()
  @Matches(/^\d{9}$/, { message: 'EIN must be exactly 9 digits' })
  @Length(9, 9, { message: 'EIN must be exactly 9 characters long' })
  ein: string;
}
